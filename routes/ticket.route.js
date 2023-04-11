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
  commentPermission,
} = require("../middlewares/auth");
const {
  createComment,
  fetchComment,
} = require("../controllers/comment.controller");

const router = express.Router();

router
  .route("/")
  .post([verifyToken, validateRequest], createTicket)
  .get(verifyToken, getAllTickets);
router
  .route("/:id")
  .put([verifyToken, ticketPermission], updateTicket)
  .get([verifyToken, isAdmin], getTicket);
router
  .route("/:ticketId/comments")
  .post([verifyToken, commentPermission], createComment)
  .get([verifyToken, isAdmin], fetchComment);

module.exports = router;
