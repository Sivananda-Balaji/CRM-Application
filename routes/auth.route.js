const { signUp, signIn } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);

module.exports = router;
