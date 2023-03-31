const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");

const signUp = async (req, res) => {
  try {
    let { name, userId, email, password, userType, userStatus } = req.body;
    if (userType === "ENGINEER") {
      userStatus = "PENDING";
    }
    password = bcrypt.hashSync(password, 10);
    const userObj = { name, email, password, userType, userStatus, userId };
    const user = await User.create(userObj);
    res.send({
      name: user.name,
      email: user.email,
      userId: user.userId,
      userType: user.userType,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
    if (user === null) {
      return res.status(400).send({ message: "user doesn't exist!" });
    }
    if (user.userStatus !== "APPROVED") {
      return res
        .status(401)
        .send({ message: "userStatus is in pending status!" });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.send("Invalid password!");
    }
    //creating token
    const token = jwt.sign({ id: user.userId }, secret, { expiresIn: 5000 });
    res.send({
      name: user.name,
      email: user.email,
      userId: user.userId,
      userType: user.userType,
      userStatus: user.userStatus,
      accessToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { signUp, signIn };
