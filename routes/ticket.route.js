const express = require("express");
const { createTicket } = require("../controllers/ticket.controller");
const { validateRequest } = require("../middlewares/verifyTicket");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post([verifyToken, validateRequest], createTicket);

module.exports = router;
