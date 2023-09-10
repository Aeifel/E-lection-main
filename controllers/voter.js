const User = require("../models").User;
const Election = require("../models").Election;
const ElectionVoter  = require("../models").ElectionVoter;
const ElectionCandidate = require("../models").ElectionCandidate;
const Request = require("../models").Request;
const Vote = require("../models").Vote;

const {isValidVoter, getPendingRequests, getVotedElections} = require("../helpers/voter");

const {Op} = require("sequelize");

const sendRequest = async(req, res, next) => {
    try{
        const requesteeId = req.user.id;
        const {electionId, requestType} = req.body;
        const request = await Request.findOne({
            where:{
                requesteeId:requesteeId,
                electionId:electionId,
                requestType:requestType,
            }});
        if (request){
            res.status(400).json({msg:"Request already exists"});
            return;
        }
        const newRequest = await Request.create({
            requesteeId:requesteeId,
            electionId:electionId,
            requestType:requestType,
            status:"waiting",
        });
        res.status(200).json({msg:"Request sent successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const castVote = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const {electionId, candidateId} = req.body;
        const election = await Election.findByPk(electionId);
        if (! await isValidVoter(userId,electionId) || election.status !== "ongoing"){
            res.status(403).send({msg:"Forbidden"});
            return;
        }
        const vote = await Vote.create({
            electionId:electionId,
            voterId:userId,
            candidateId:candidateId,
        });
        
        res.status(200).send({msg:"Voted casted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getEnrolledElections = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const electionsToVote = await ElectionVoter.findAll({
            where:{
                voterId:userId,
            },
            include:[{
                    model: Election,
                    required: true
            }],
        });

        console.log(electionsToVote);
        res.json({enrolledElections:electionsToVote});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getAllElectionsWithStatus = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const allElections = await Election.findAll({
            where:{
                status:{
                    [Op.or]:["waiting","ongoing"],
                }
            },
            raw:true,
        });

        const userRequestedElections = await Request.findAll({
            where:{
                requesteeId:userId,
            },
            raw:true
        })
        console.log(userRequestedElections);

        let responseObject = allElections;
        responseObject.forEach((election) => {
            election.status = "not requested";
            console.log(election);
            let temp = userRequestedElections.filter((relection) => relection.electionId === election.id);
            if (temp.length > 0){
                console.log(temp);
                election.status = temp[0].status;
            }
        })

        res.json({allElections:responseObject});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getMyRequests = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const myRequests = await Request.findAll({
            where:{
                requesteeId:userId,
            },
            include:[{
                model:Election,
                required:true,
            }],
        });
        console.log(myRequests);
        res.json({myRequests:myRequests});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getCandidates = async(req, res, next) => {
    try{
        const {electionId} = req.body;
        const candidates = await ElectionCandidate.findAll({
            where:{
                electionId:electionId,
            },
            include:[
                {
                    model:User,
                    required:true,
                }
            ]
        });
        console.log(candidates);
        res.json({candidates:candidates});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

module.exports = {
    sendRequest,
    castVote,
    getEnrolledElections,
    getAllElectionsWithStatus,
    getMyRequests,
    getCandidates,
}