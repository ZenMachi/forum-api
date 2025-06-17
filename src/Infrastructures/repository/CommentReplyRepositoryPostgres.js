const AddedCommentReply = require("../../Domains/comment_reply/entities/AddedCommentReply");
const CommentReplyRepository = require("../../Domains/comment_reply/CommentReplyRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentReply(commentReplyContent, commentId, threadId, ownerId) {
    const id = `reply-${this._idGenerator()}`;
    const dateTime = new Date();
    const isDeleted = false;
    const query = {
      text: "INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, owner, content",
      values: [
        id,
        threadId,
        commentId,
        ownerId,
        commentReplyContent,
        dateTime,
        isDeleted,
      ],
    };

    const result = await this._pool.query(query);

    const addedCommentReply = new AddedCommentReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });

    return addedCommentReply;
  }

  async getCommentReplyById(id) {
    const query = {
      text: "SELECT * FROM comment_replies WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Balasan komentar tidak ditemukan");
    }

    return result.rows[0];
  }

  async getCommentRepliesByCommentId(commentId) {
    const query = {
      text: "SELECT * FROM comment_replies WHERE comment_id = $1 ORDER BY created_at ASC",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return []; // Return an empty array if no replies found
    }

    return result.rows;
  }

  async deleteCommentReply(commentReplyId, threadId, commentId, ownerId) {
    const query = {
      text: "UPDATE comment_replies SET is_deleted = true WHERE id = $1 AND thread_id = $2 AND comment_id = $3 AND owner = $4 RETURNING id",
      values: [commentReplyId, threadId, commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError(
        "Balasan komentar gagal dihapus. Id tidak ditemukan"
      );
    }
  }
}

module.exports = CommentReplyRepositoryPostgres;
