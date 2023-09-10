var express = require('express');
const router = express.Router();
const {validate} = require('../validators/index');
const {authenticateToken, signToken} = require('../utils/Jauth');
const {
  signupChain,
  loginChain,
} = require('../validators/userValidator');

const {userLogin , userSignUp , getUserDetails } = require('../controllers/user');

router.post('/login' , validate(loginChain), userLogin, signToken);

router.post('/signup' , validate(signupChain), userSignUp, signToken);

router.post('/getDetails' , authenticateToken,getUserDetails);

module.exports = router;
