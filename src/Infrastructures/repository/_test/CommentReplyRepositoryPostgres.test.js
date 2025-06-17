const pool = require("../../../Infrastructures/database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AddCommentReply = require("../../../Domains/comment_reply/entities/AddCommentReply");
const AddedCommentReply = require("../../../Domains/comment_reply/entities/AddedCommentReply");
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");
const CommentReplyTableTestHelper = require("../../../../tests/CommentReplyTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("CommentReplyRepositoryPostgres", () => {
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      threadId,
      owner: userId,
    });
  });

  afterEach(async () => {
    await CommentReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addCommentReply function", () => {
    it("should persist add comment reply and return added comment reply correctly", async () => {
      // Arrange
      const addCommentReply = new AddCommentReply({
        content: "This is a reply",
      });
      const fakeIdGenerator = () => "123"; // stub id generator
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedCommentReply =
        await commentReplyRepositoryPostgres.addCommentReply(
          addCommentReply.content,
          commentId,
          threadId,
          userId
        );

      // Assert
      const commentReplies =
        await CommentReplyTableTestHelper.getCommentReplyById("reply-123");

      expect(commentReplies).toHaveLength(1);
      expect(addedCommentReply).toStrictEqual(
        new AddedCommentReply({
          id: "reply-123",
          content: "This is a reply",
          owner: "user-123",
        })
      );
    });
  });

  describe("getCommentReplyById function", () => {
    it("should throw NotFoundError when comment reply not found", async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentReplyRepositoryPostgres.getCommentReplyById("reply-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return comment reply correctly", async () => {
      // Arrange
      const createdAt = new Date();
      const commentReply = {
        id: "reply-123",
        threadId,
        commentId,
        owner: userId,
        content: "This is a reply",
        createdAt: createdAt,
        isDeleted: false,
      };
      await CommentReplyTableTestHelper.addCommentReply(commentReply);
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result = await commentReplyRepositoryPostgres.getCommentReplyById(
        commentReply.id
      );

      // Assert
      expect(result.id).toEqual("reply-123");
      expect(result.thread_id).toEqual("thread-123");
      expect(result.comment_id).toEqual("comment-123");
      expect(result.owner).toEqual("user-123");
      expect(result.content).toEqual("This is a reply");
      expect(result.created_at).toEqual(createdAt);
      expect(result.is_deleted).toEqual(false);
    });
  });

  describe("getCommentRepliesByCommentId function", () => {
    it("should return empty array when no replies found", async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result =
        await commentReplyRepositoryPostgres.getCommentRepliesByCommentId(
          commentId
        );

      // Assert
      expect(result).toEqual([]);
    });

    it("should return comment replies correctly", async () => {
      // Arrange
      const createdAt = new Date();
      const commentReplies = [
        {
          id: "reply-123",
          threadId,
          commentId,
          owner: userId,
          content: "This is reply 1",
          createdAt: createdAt,
          isDeleted: false,
        },
        {
          id: "reply-456",
          threadId,
          commentId,
          owner: userId,
          content: "This is reply 2",
          createdAt: createdAt,
          isDeleted: false,
        },
      ];

      const expectedCommentReplies = [
        {
          id: "reply-123",
          thread_id: "thread-123",
          comment_id: "comment-123",
          owner: "user-123",
          content: "This is reply 1",
          created_at: createdAt,
          is_deleted: false,
        },
        {
          id: "reply-456",
          thread_id: "thread-123",
          comment_id: "comment-123",
          owner: "user-123",
          content: "This is reply 2",
          created_at: createdAt,
          is_deleted: false,
        },
      ];

      await CommentReplyTableTestHelper.addCommentReply(commentReplies[0]);
      await CommentReplyTableTestHelper.addCommentReply(commentReplies[1]);
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const result =
        await commentReplyRepositoryPostgres.getCommentRepliesByCommentId(
          commentId
        );

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toStrictEqual(expectedCommentReplies);
    });
  });

  describe("deleteCommentReply function", () => {
    it("should throw NotFoundError when comment reply not found", async () => {
      // Arrange
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action & Assert
      await expect(
        commentReplyRepositoryPostgres.deleteCommentReply(
          "reply-123",
          threadId,
          commentId,
          userId
        )
      ).rejects.toThrow(InvariantError);
    });

    it("should delete comment reply correctly", async () => {
      // Arrange
      const commentReply = {
        id: "reply-123",
        threadId,
        commentId,
        owner: userId,
        content: "This is a reply",
        createdAt: new Date(),
        isDeleted: false,
      };
      await CommentReplyTableTestHelper.addCommentReply(commentReply);
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      await commentReplyRepositoryPostgres.deleteCommentReply(
        commentReply.id,
        threadId,
        commentId,
        userId
      );

      // Assert
      const result = await CommentReplyTableTestHelper.getCommentReplyById(
        commentReply.id
      );
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].is_deleted).toBe(true);
    });
  });
});
