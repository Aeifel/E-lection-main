const Election = require("../models").Election;
const ElectionVoter = require("../models").ElectionVoter;
const Vote = require("../models").Vote;
const Request = require("../models").Request;

const isValidVoter = async(userId, electionId) => {
    const voterExists = await ElectionVoter.findOne({
        where:{
            electionId:electionId,
            voterId:userId
        }
    })  
    if (voterExists)
        return true;
    return false;
}

const getEnrolledElections = async(userId) => {
    try{
        const enrolledElections = await ElectionVoter.findAll({
            where:{
                voterId:userId,
            },
            include:[{
                model: Election,
                required: true
            }],
            raw:true,
        });
        return enrolledElections;
    }
    catch(err){
        console.log(err);
        return [];
    }
}

const getVotedElections = async(userId) => {
    const votedElections = await Vote.findAll({
        where:{
            voterId:userId,
        },
        include:[{
            model: Election,
            required: true
        }],
        raw:true,
    });
    return votedElections;
}

const getPendingRequests = async(userId) => {
    const pendingRequests = await Request.findAll({
        where:{
            requesteeId:userId,
            status:"waiting",
        }
    });
    return pendingRequests;
}



module.exports = {
    isValidVoter,
    getEnrolledElections,
    getVotedElections,
    getPendingRequests,
}