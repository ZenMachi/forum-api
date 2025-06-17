const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentReplyTableTestHelper = {
  async addCommentReply({
    id = "reply-123",
    threadId = "thread-123",
    commentId = "comment-123",
    owner = "user-123",
    content = "this is comment reply",
    createdAt = new Date(),
    isDeleted = false,
  }) {
    const query = {
      text: "INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner",
      values: [id, threadId, commentId, owner, content, createdAt, isDeleted],
    };

    await pool.query(query);
  },

  async getCommentReplyById(id) {
    const query = {
      text: "SELECT * FROM comment_replies WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_replies WHERE 1=1");
  },
};

module.exports = CommentReplyTableTestHelper;
