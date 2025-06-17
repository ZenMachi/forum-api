const pool = require("../../../Infrastructures/database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("CommentRepositoryPostgres", () => {
  const userId = "user-123";
  const threadId = "thread-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        content: "A Comment Content",
      });
      const fakeIdGenerator = () => "123"; // stub id generator
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment.content,
        threadId,
        userId
      );

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(
        addedComment.id
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: addComment.content,
          owner: userId,
        })
      );
      expect(comments).toHaveLength(1);
    });
  });

  describe("getCommentById function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById("comment-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return comment correctly when comment is found", async () => {
      // Arrange
      const addComment = new AddComment({
        content: "A Comment Content",
      });
      const fakeIdGenerator = () => "123"; // stub id generator
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment.content,
        threadId,
        userId
      );

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        addedComment.id
      );

      // Assert
      expect(comment).toHaveProperty("id", addedComment.id);
      expect(comment).toHaveProperty("thread_id", threadId);
      expect(comment).toHaveProperty("owner", userId);
      expect(comment).toHaveProperty("content", addComment.content);
      expect(comment).toHaveProperty("is_deleted", false);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return empty array when no comments found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      // Assert
      expect(comments).toEqual([]);
    });

    it("should return comments correctly when comments are found", async () => {
      // Arrange
      const addComment1 = new AddComment({
        content: "First Comment",
      });
      const addComment2 = new AddComment({
        content: "Second Comment",
      });
      const createdAt = new Date();

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: addComment1.content,
        threadId,
        owner: userId,
        createdAt: createdAt,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-456",
        content: addComment2.content,
        threadId,
        owner: userId,
        createdAt: createdAt,
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      );

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0]).toHaveProperty("id", "comment-123");
      expect(comments[0]).toHaveProperty("thread_id", "thread-123");
      expect(comments[0]).toHaveProperty("owner", "user-123");
      expect(comments[0]).toHaveProperty("content", "First Comment");
      expect(comments[0]).toHaveProperty("created_at", createdAt);
      expect(comments[0]).toHaveProperty("is_deleted", false);

      expect(comments[1]).toHaveProperty("id", "comment-456");
      expect(comments[1]).toHaveProperty("thread_id", "thread-123");
      expect(comments[1]).toHaveProperty("owner", "user-123");
      expect(comments[1]).toHaveProperty("content", "Second Comment");
      expect(comments[1]).toHaveProperty("created_at", createdAt);
      expect(comments[1]).toHaveProperty("is_deleted", false);
    });
  });

  describe("deleteComment function", () => {
    it("should throw InvariantError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment("comment-123", threadId, userId)
      ).rejects.toThrow(InvariantError);
    });

    it("should delete comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        content: "A Comment Content",
      });
      const fakeIdGenerator = () => "123"; // stub id generator
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment.content,
        threadId,
        userId
      );

      // Action
      await commentRepositoryPostgres.deleteComment(
        addedComment.id,
        threadId,
        userId
      );

      // Assert
      const result = await CommentsTableTestHelper.getCommentById(
        addedComment.id
      );

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].is_deleted).toBe(true);
    });
  });
});
