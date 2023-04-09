const Ticket = require("../models/ticket.model");
const { ticketResponse, ticketResFilter } = require("../utils/objectConvertor");
const User = require("../models/user.model");
const constants = require("../utils/constants");

const createTicket = async (req, res) => {
  try {
    const { title, description, ticketPriority, status } = req.body;
    const ticketObj = {
      title,
      description,
      ticketPriority,
      status,
      reporter: req.userId,
    };
    const engineer = await User.findOne({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    });
    ticketObj.assignee = engineer.userId;
    const ticket = await Ticket.create(ticketObj);
    if (ticket) {
      const user = await User.findOne({
        userId: req.userId,
      });
      user.ticketsCreated.push(ticket._id);
      await user.save();
      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();
    }
    res.send(ticketResponse(ticket));
  } catch (err) {
    console.log(`Error: ${err}`);
    res.send(500).send({
      message: "internal server error",
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ticketPriority, status, assignee } = req.body;
    const ticket = await Ticket.findById(id);
    const oldAssignee = ticket && ticket.assignee;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        ticketPriority,
        status,
        assignee,
        updateAt: Date.now,
      },
      { new: true }
    );
    if (updatedTicket && assignee) {
      await User.updateOne(
        { userId: assignee },
        { $push: { ticketsAssigned: id } }
      );
      await User.updateOne(
        { userId: oldAssignee },
        { $pull: { ticketsAssigned: id } }
      );
    }
    if (updatedTicket) {
      res.send(ticketResponse(updatedTicket));
    } else {
      res.status(404).send({
        message: "Ticket Not Found.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

const getAllTickets = async (req, res) => {
  const queryObj = {};

  const { status } = req.query;
  if (status) {
    queryObj.status = new RegExp(status, "i");
  }
  const loggedInUser = await User.findOne({ userId: req.userId });
  if (loggedInUser.userType === constants.userTypes.engineer) {
    queryObj.assignee = req.userId;
  }
  if (loggedInUser.userType === constants.userTypes.customer) {
    queryObj.reporter = req.userId;
  }
  const tickets = await Ticket.find(queryObj);
  res.status(200).send(ticketResFilter(tickets));
};

const getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    res.send(ticket);
  } catch (err) {
    return res.status(500).send({ message: "internal server error" });
  }
};

module.exports = { createTicket, updateTicket, getAllTickets, getTicket };
