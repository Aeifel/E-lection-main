const User = require("../models").User;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSignUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const exisitingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (exisitingUser) {
      res.status(405).send({msg:"User already exists"});
      return;
    }
    const hashed = bcrypt.hashSync(password, saltRounds);
    const newUser = await User.create({
      email: email,
      password: hashed,
      name: name,
    });
    req.user = newUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exisitingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!exisitingUser) {
      res.status(405).send({ msg: "User does not exist" });
      return;
    }
    const passwordRes = bcrypt.compareSync(password, exisitingUser.password);
    if (passwordRes) {
      req.user = exisitingUser;
      next();
    } else {
      res.status(405).send({ msg: "Incorrect Password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};


const getUserDetails = async (req, res, next) => {
  try {
    const {id} = req.user;
    const userDetails = await User.findOne({
      where:{
        id:id
      },attributes: { exclude: ['password'] }});
    if(!userDetails){
        res.status(405).send({msg:"User does not exist"});
        return;
    }
    res.json({
        userDetails: userDetails,
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const getElections = async (req, res, next) => {
  try{
    const {id} = req.user;
  }
  catch(err){
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
}

module.exports = {
  userLogin,
  userSignUp,
  getUserDetails,
};
