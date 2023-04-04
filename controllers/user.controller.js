const User = require("../models/user.model");
const { userResponse } = require("../utils/objectConvertor");

const findAll = async (req, res) => {
  try {
    const users = await User.find({ ...req.query });
    res.status(200).send(userResponse(users));
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error!",
    });
  }
};

const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userId: id });
    if (user) {
      res.send(userResponse([user])[0]);
    } else {
      return res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, userType, userStatus } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { userId: id },
      { name, userType, userStatus, updatedAt: Date.now() },
      { new: true }
    );
    if (updatedUser) {
      res.send(userResponse([updatedUser])[0]);
    } else {
      return res.status(404).send("User Not Found!");
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

module.exports = { findAll, findById, updateUser };
