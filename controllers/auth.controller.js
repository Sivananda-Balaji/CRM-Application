const User = require("../models/user.model");

const signUp = async (req, res) => {
  const { name, userId, email, password, userType, userStatus } = req.body;

  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

module.exports = { signUp };
