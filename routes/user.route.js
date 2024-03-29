const {
  findAll,
  findById,
  updateUser,
} = require("../controllers/user.controller");
const express = require("express");
const { verifyToken, isAdmin, checkUserType } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get([verifyToken, isAdmin], findAll);
router
  .route("/:id")
  .get([verifyToken, isAdmin], findById)
  .put([verifyToken, checkUserType], updateUser);

module.exports = router;
