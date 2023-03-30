const { signUp } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.route("/signup").post(signUp);

module.exports = router;
