const { query, validationResult, body } = require("express-validator");

const signupChain = [
  body("email").trim().notEmpty().isEmail().withMessage("Invalid email").escape(),
  body("password").notEmpty().withMessage("Password cannot be empty").escape(),
  body("name").trim().notEmpty().withMessage("Name cannot be empty"),
]
const loginChain = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Invalid Email")
    .escape(),
]
module.exports = {
  signupChain,
  loginChain,
};
