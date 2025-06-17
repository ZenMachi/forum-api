const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentContent, threadId, ownerId) {
    const id = `comment-${this._idGenerator()}`;
    const dateTime = new Date();
    const isDeleted = false;
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, owner, content",
      values: [id, threadId, ownerId, commentContent, dateTime, isDeleted],
    };

    const result = await this._pool.query(query);

    const addedComment = new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });

    return addedComment;
  }

  async getCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }

    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: "SELECT * FROM comments WHERE thread_id = $1 ORDER BY created_at ASC",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return []; // Return an empty array if no comments found
    }

    return result.rows;
  }

  async deleteComment(id, threadId, owner) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 AND thread_id = $2 AND owner = $3 RETURNING id",
      values: [id, threadId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Komentar gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = CommentRepositoryPostgres;
