const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");
const User = require("../models/user.model");

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
      message: "Admin only access the user details",
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
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = { verifyToken, isAdmin, checkUserType };
