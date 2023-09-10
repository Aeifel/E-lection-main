const Election = require("../models").Election;

const isAdminAuth = async(req, res, next) => {
    const {id} = req.user;
    const {electionId} = req.body;
    console.log(req.body);
    const election = await Election.findOne({
        where:{
            id:electionId,
            adminId:id
        }
    });
    if (!election){
        res.status(403).send({msg:"Unauthorized"});
        return;
    }
    next();
};


module.exports = {
    isAdminAuth,
}