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
    assignee: ticket.assignee,
    _id: ticket._id,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
};

const ticketResFilter = (tickets) => {
  const ticketResult = [];
  tickets.forEach((ticket) => {
    ticketResult.push({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      reporter: ticket.reporter,
      assignee: ticket.assignee,
      _id: ticket._id,
    });
  });
  return ticketResult;
};

const commentResponse = ({ _id, content, ticketId, commenterId }) => ({
  _id,
  content,
  ticketId,
  commenterId,
});
module.exports = {
  userResponse,
  ticketResponse,
  ticketResFilter,
  commentResponse,
};
