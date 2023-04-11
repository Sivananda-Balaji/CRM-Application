const Comment = require("../models/comment.model");
const { commentResponse } = require("../utils/objectConvertor");

const createComment = async (req, res) => {
  try {
    const commentObj = {
      content: req.body.content,
      ticketId: req.params.ticketId,
      commenterId: req.userId,
    };
    const comment = await Comment.create(commentObj);
    res.send(commentResponse(comment));
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

const fetchComment = async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId });
    res.send(comments);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

module.exports = { createComment, fetchComment };
