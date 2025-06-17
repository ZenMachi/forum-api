const CommentReplyRepository = require("../../../../Domains/comment_reply/CommentReplyRepository");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");
const AddedCommentReply = require("../../../../Domains/comment_reply/entities/AddedCommentReply");
const AddCommentReply = require("../../../../Domains/comment_reply/entities/AddCommentReply");
const UserRepository = require("../../../../Domains/users/UserRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");

describe("AddCommentReplyUseCase", () => {
  it("should orchestrate add comment reply", async () => {
    const payload = {
      content: "this is comment reply",
    };
    const mockUserResult = {
      id: "user-123",
      username: "dicoding",
      password: "secret_password",
      fullname: "Dicoding Indonesia",
    };
    const mockthreadResult = {
      id: "thread-123",
      owner: "user-123",
      title: "Thread Title",
      body: "Thread Body",
      created_at: "2025-10-01T00:00:00.000Z",
    };
    const mockCommentResult = {
      id: "comment-123",
      thread_id: "thread-123",
      owner: "user-123",
      content: "Comment Content",
      created_at: "2025-10-01T01:00:00.000Z",
      is_deleted: false,
    };

    const mockAddedCommentReply = new AddedCommentReply({
      id: "reply-123",
      content: payload.content,
      owner: mockUserResult.id,
    });

    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentResult));

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockthreadResult));

    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUserResult));

    mockCommentReplyRepository.addCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentReply));

    const addCommentReplyUseCase = new AddCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const result = await addCommentReplyUseCase.execute(
      payload,
      mockthreadResult.id,
      mockCommentResult.id,
      mockUserResult.id
    );

    expect(result).toStrictEqual(
      new AddedCommentReply({
        id: "reply-123",
        content: "this is comment reply",
        owner: "user-123",
      })
    );

    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("user-123");
    expect(mockCommentReplyRepository.addCommentReply).toHaveBeenCalledWith(
      new AddCommentReply({
        content: "this is comment reply",
      }).content,
      "comment-123",
      "thread-123",
      "user-123"
    );
  });
});
