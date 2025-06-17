const CommentReplyHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "comment_reply",
  register: async (server, { container }) => {
    const commentReplyHandler = new CommentReplyHandler(container);
    server.route(routes(commentReplyHandler));
  },
};
