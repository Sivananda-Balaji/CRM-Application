const userResponse = (users) => {
  const userResult = [];
  users.forEach((user) => {
    userResult.push({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  });
  return userResult;
};

const ticketResponse = (ticket) => {
  return {
    title: ticket.title,
    description: ticket.description,
    ticketPriority: ticket.ticketPriority,
    status: ticket.status,
    reporter: ticket.reporter,
    _id: ticket._id,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
};

module.exports = { userResponse, ticketResponse };
