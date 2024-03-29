const express = require("express");
const mongoose = require("mongoose");
const { PORT } = require("./configs/server.config");
const authRouter = require("./routes/auth.route");
const { DB_URL } = require("./configs/db.config");
const userRouter = require("./routes/user.route");
const ticketRouter = require("./routes/ticket.route");

const app = express();

//request middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//MongoDB Connection
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

//middleware using url
app.use("/crm/api/v1/auth", authRouter);
app.use("/crm/api/v1/users", userRouter);
app.use("/crm/api/v1/tickets", ticketRouter);

// server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
