const validateRequest = (req, res, next) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res.status(400).send("title is required");
  }
  if (!description) {
    return res.status(400).send("description is required");
  }
  if (!status) {
    return res.status(400).send("status is required");
  }
  next();
};

module.exports = { validateRequest };
