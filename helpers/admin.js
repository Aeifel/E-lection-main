const ElectionVoter = require('../models').ElectionVoter;
const ElectionCandidate = require("../models").ElectionCandidate;
const Election = require("../models").Election;

const isAvailableElection = ( election ) => {
    if (election.status === "waiting" || election.status === "ongoing"){
        return true;
    }
    return false;
}

const addVoterToElection = async (voterId,electionId) => {
    const voterAlreadyIncluded = await ElectionVoter.findOne({
        where:{
            voterId:voterId,
            electionId:electionId
        }
    });
    if (voterAlreadyIncluded){
        return;
    }
    const newVoter = await ElectionVoter.create({
        voterId:voterId,
        electionId:electionId,
    });
}

const addCandidateToElection = async (candidateId,electionId) => {
    const candidateAlreadyIncluded = await ElectionCandidate.findOne({
        where:{
            candidateId:candidateId,
            electionId:electionId
        }
    });
    if (candidateAlreadyIncluded){
        return;
    }
    const newCandidate = await ElectionCandidate.create({
        candidateId:candidateId,
        electionId:electionId,
    });
}

module.exports = {
    isAvailableElection,
    addVoterToElection,
    addCandidateToElection
}