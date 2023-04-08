const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ticketPriority: {
    type: Number,
    default: 5,
  },
  status: {
    type: String,
    required: true,
  },
  reporter: {
    type: String,
  },
  assignee: {
    type: String,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
