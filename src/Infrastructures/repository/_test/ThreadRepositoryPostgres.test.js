const pool = require("../../../Infrastructures/database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  const userId = "user-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        title: "A Thread Title",
        body: "A Thread Body",
      });
      const fakeIdGenerator = () => "123"; // stub id generator
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        addThread,
        userId
      );

      // Assert
      const threads = await ThreadTableTestHelper.getThreadById(addedThread.id);
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: addThread.title,
          owner: userId,
        })
      );
      expect(threads).toHaveLength(1);
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("thread-123")
      ).rejects.toThrow(NotFoundError);
    });
  });

  it("should return thread correctly when thread found", async () => {
    // Arrange
    const threadId = "thread-123";
    const createdAt = new Date();
    await ThreadTableTestHelper.addThread({
      id: threadId,
      owner: userId,
      createdAt: createdAt,
    });
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

    // Action
    const thread = await threadRepositoryPostgres.getThreadById(threadId);

    // Assert
    expect(thread).toHaveProperty("id", "thread-123");
    expect(thread).toHaveProperty("owner", "user-123");
    expect(thread).toHaveProperty("title", "this is thread title");
    expect(thread).toHaveProperty("body", "this is thread body");
    expect(thread).toHaveProperty("created_at", createdAt);
  });
});
