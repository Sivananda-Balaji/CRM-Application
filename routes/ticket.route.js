const express = require("express");
const {
  createTicket,
  updateTicket,
  getAllTickets,
  getTicket,
} = require("../controllers/ticket.controller");
const { validateRequest } = require("../middlewares/verifyTicket");
const {
  verifyToken,
  ticketPermission,
  isAdmin,
} = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post([verifyToken, validateRequest], createTicket)
  .get(verifyToken, getAllTickets);
router
  .route("/:id")
  .put([verifyToken, ticketPermission], updateTicket)
  .get([verifyToken, isAdmin], getTicket);

module.exports = router;
