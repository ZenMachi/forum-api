const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread, ownerId) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const dateTime = new Date();
    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, owner, title",
      values: [id, ownerId, title, body, dateTime],
    };

    const result = await this._pool.query(query);
    const addedThread = new AddedThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].owner,
    });
    return addedThread;
  }

  async getThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Thread tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
