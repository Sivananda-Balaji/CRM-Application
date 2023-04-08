const Ticket = require("../models/ticket.model");
const { ticketResponse } = require("../utils/objectConvertor");
const User = require("../models/user.model");

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

module.exports = { createTicket };
