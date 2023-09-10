const User = require("../models").User;
const Election = require("../models").Election;
const ElectionCandidate = require("../models").ElectionCandidate;
const ElectionVoter = require("../models").ElectionVoter;
const Request = require("../models").Request;

const { Op } = require("sequelize");
const { isAvailableElection, addVoterToElection, addCandidateToElection} = require("../helpers/admin");
const { findWinner } = require("../helpers/election");
const { sequelize } = require("../models");
const createElection = async(req, res, next) => {
    try{
        const user = await User.findByPk(req.user.id);
        const {name} = req.body;
        await ElectionCandidate.findAll();
        await ElectionVoter.findAll();
        const nameAlreadyExists = await Election.findOne({
            where:{
                name:name,
            },
        });
        console.log(nameAlreadyExists);
        if (nameAlreadyExists){
            res.status(400).send({msg:"Name already taken"});
            return;
        }
        if(!user){
            res.status(400).json({msg:"User does not exist"});
            return;
        }
        const newElection = await Election.create({
            name:name,
            adminId:user.id,
            status:"waiting",
        });
        res.status(200).json({msg:"New election created successfully", election:newElection});
    }
    catch(err) {
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const openElection = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const {electionId} = req.body;
        const election = await Election.findByPk(electionId);
        if ( election.status === "waiting"){
            election.status = "ongoing";
            await election.save();
        }
        res.status(200).send({msg:"Election has started"});

    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const closeElection = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const {electionId} = req.body;
        const election = await Election.findByPk(electionId);
        // if (election.status === "ongoing"){
            console.log(election);
            await findWinner(electionId);
        // }
        res.status(200).send({msg:"Election Closed Succesfully"})
    }
    catch(err) {
        res.status(500).send({msg:"Internal Server Error"});
    }
}
const acceptRequest = async(req, res, next) => {
    try{
        const adminId = req.user.id;
        const {requesteeId,electionId, requestType} = req.body;
        console.log(req.body);
        const request = await Request.findOne({
            where:{
                requesteeId:requesteeId,
                electionId:electionId,
            }});
        console.log(request);
        const election = await Election.findByPk(electionId);
        console.log(election);
        if (!request || request.status == "rejected" || request.status == "accepted" || !isAvailableElection(election)){
            res.status(400).json({msg:"Invalid request generated"});
            return;
        }
        request.status = "accepted";
        await request.save();
        if (requestType == "voter"){
            await addVoterToElection(requesteeId, electionId);
        }
        else if (requestType == "candidate"){
            await addCandidateToElection(requesteeId, electionId);
        }
        res.status(200).json({msg:"Request accepted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const rejectRequest = async(req, res, next) => {
    try{
        const adminId = req.user.id;
        const {requesteeId,electionId} = req.body;
        const request = await Request.findOne({
            where:{
                requesteeId:requesteeId,
                electionId:electionId,
            }});
        if (!request || request.status == "rejected" || request.status == "accepted"){
            res.status(400).json({msg:"Invalid request generated"});
            return;
        }
        request.status = "rejected";
        await request.save();
        res.status(200).json({msg:"Request rejected successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getAllRequests = async(req, res, next) => {
    try{
        const {electionId} = req.body;
        const acceptedRequests = await Request.findAll({
            where:{
                electionId:electionId,
                status:"accepted",
            },
            raw:true,
        });
        const rejectedRequests = await Request.findAll({
            where:{
                electionId:electionId,
                status:"rejected",
            },
            raw:true,
        });
        const waitingRequests = await Request.findAll({
            where:{
                electionId:electionId,
                status:"waiting",
            },
            raw:true,
        });
        res.status(200).json({acceptRequests:acceptedRequests, rejectedRequests:rejectedRequests, waitingRequests:waitingRequests});

    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getCreatedElections = async (req, res, next) => {
    try{
        const {id} = req.user;
        const elections = await Election.findAll({
            where:{
                adminId:id,
            },
            raw:true,
        });
        res.status(200).json({createdElections:elections});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getAwaitingRequests = async (req, res, next) => {
    try{
        const userId = req.user.id;
        console.log(userId);
        const adminElections = await Election.findAll({
            where:{
                adminId:userId,
            },
            attributes:['id'],
            raw:true
        });

        let tempArr = adminElections.map((election) => election.id)
        console.log(adminElections);
        const awaitingRequests = await Request.findAll({
            where:{
                electionId:{
                    [Op.in]:tempArr,
                },
                status:"waiting",
            },
            include:[
                {
                    model:Election,
                    required:true,
                    attributes:['name']
                },
                {
                    model:User,
                    required:true,
                }
            ]
        });
        res.json({awaitingRequests: awaitingRequests});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

module.exports = {
    createElection,
    acceptRequest,
    rejectRequest,
    openElection,
    closeElection,
    getCreatedElections,
    getAwaitingRequests,
}