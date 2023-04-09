const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");
const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "no token provided",
    });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "unauthorized user",
      });
    }
    req.userId = decoded.id;
  });
  next();
};

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ userId: req.userId });
  if (user && user.userType === "ADMIN") {
    next();
  } else {
    return res.status(403).send({
      message: "Admin only access the particular user / ticket details",
    });
  }
};

const checkUserType = async (req, res, next) => {
  try {
    const loggedInUser = await User.findOne({ userId: req.userId });
    const userToUpdate = await User.findOne({ userId: req.params.id });

    const allowedUserTypes = ["ADMIN", "ENGINEER", "CUSTOMER"];

    if (!allowedUserTypes.includes(loggedInUser.userType)) {
      return res.status(403).send({ message: "User Type is not valid!" });
    }
    const { userType, userStatus } = req.body;
    if (
      loggedInUser.userId === userToUpdate.userId &&
      (userType || userStatus)
    ) {
      return res.status(403).send({
        message: "Only Admin should Update the userType or userStatus.",
      });
    }

    if (
      (loggedInUser && loggedInUser.userType === "ADMIN") ||
      loggedInUser.userId === userToUpdate.userId
    ) {
      next();
    } else {
      return res.status(403).send({
        message: "Admin or Account Owner should update the user account!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const ticketPermission = async (req, res, next) => {
  try {
    const loggedInUser = await User.findOne({ userId: req.userId });
    const ticketToUpdate = await Ticket.findOne({ _id: req.params.id });
    //logic for enginner to update ticket
    if (loggedInUser.userType === "ENGINEER") {
      const { status, ...rest } = req.body;
      if (Object.keys(rest).length > 0) {
        return res
          .status(403)
          .send({ message: "Engineers are allowed to change status only" });
      }
    }
    //logic for customer to update ticket
    if (loggedInUser.userType === "CUSTOMER") {
      const { title, description, ticketPriority, ...rest } = req.body;
      if (Object.keys(rest).length > 0) {
        return res.status(403).send({
          message:
            "Customers are allowed to change title,description and priority",
        });
      }
    }
    if (
      loggedInUser.userType === "CUSTOMER" &&
      loggedInUser.userId !== ticketToUpdate.reporter
    ) {
      return res.status(403).send({
        message: "Only ticket owner or ADMIN update the ticket",
      });
    }
    // logic for ADMIN to update ticket
    if (loggedInUser.userType === "ADMIN") {
      const { assignee } = req.body;
      const user = await User.findOne({ userId: assignee });
      if (user.userType === "CUSTOMER") {
        return res.status(403).send({
          message: "Can't Assign Ticket to Customer",
        });
      }
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "internal server error",
    });
  }
};

module.exports = { verifyToken, isAdmin, checkUserType, ticketPermission };
