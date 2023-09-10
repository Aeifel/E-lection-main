const Vote = require("../models").Vote;
const Election = require("../models").Election;
const ElectionVoter = require("../models").ElectionVoter;
const ElectionCandidate = require("../models").ElectionCandidate;
const sequelize = require('sequelize');

const findWinner = async(electionId) => {
    try{

      let votes = await Vote.findAll({
            group:['candidateId'],
            attributes:['candidateId', [sequelize.fn('COUNT', 'candidateId'), 'voteCount']],
            where:{
                electionId:electionId
            },
            raw:true,
        });
        // console.log(votes);
        let maxVotes = 0;
        let winningCandidate = null;
        votes.forEach((ele) => {
            if ( ele.voteCount > maxVotes) {
                maxVotes = ele.voteCount;
                winningCandidate = ele.candidateId;
            }
        });
        //check for draw
        console.log(`The max votes are ${maxVotes}`);
        const election = await Election.findByPk(electionId);
        console.log(election);
        const winners = votes.filter((ele) => ele.voteCount === maxVotes);
        console.log(winners);
        if (winners.length > 1) {
            election.status = "draw";
            await election.save();
        }
        else{
            election.status = "finished";
            election.winnerId = winningCandidate;
            await election.save();
        }
    }
    catch(err){
        console.log(err);
    }
}
module.exports = {
    findWinner,
}