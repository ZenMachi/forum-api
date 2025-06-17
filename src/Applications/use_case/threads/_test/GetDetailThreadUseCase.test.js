const GetDetailsThreadUseCase = require("../GetDetailsThreadUseCase");

const CommentDetails = require("../../../../Domains/comments/entities/CommentDetails");
const CommentReplyDetails = require("../../../../Domains/comment_reply/entities/CommentReplyDetails");
const ThreadDetails = require("../../../../Domains/threads/entities/ThreadDetails");

const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../../Domains/comment_reply/CommentReplyRepository");

describe("GetDetailThreadUseCase", () => {
  it("should orchestrating the get detail thread action correctly", async () => {
    // Arrange
    const userJohn = {
      id: "user-123",
      username: "john_doe",
      password: "secret_password",
      fullname: "John Doe",
    };
    const userJane = {
      id: "user-456",
      username: "jane_doe",
      password: "secret_password",
      fullname: "Jane Doe",
    };

    const mockThread = {
      id: "thread-123",
      owner: userJohn.id,
      title: "Thread Title",
      body: "Thread Body",
      created_at: "2025-10-01T00:00:00.000Z",
    };

    const comments = [
      {
        id: "comment-123",
        thread_id: mockThread.id,
        owner: userJohn.id,
        content: "Comment Content",
        created_at: "2025-10-01T01:00:00.000Z",
        is_deleted: false,
      },
      {
        id: "comment-456",
        thread_id: mockThread.id,
        owner: userJohn.id,
        content: "Another Comment Content",
        created_at: "2025-10-01T02:00:00.000Z",
        is_deleted: false,
      },
      {
        id: "comment-789",
        thread_id: mockThread.id,
        owner: userJohn.id,
        content: "Yet Another Comment Content",
        created_at: "2025-10-01T03:00:00.000Z",
        is_deleted: false,
      },
    ];

    const replies = [
      {
        id: "reply-123",
        thread_id: mockThread.id,
        comment_id: comments[0].id,
        owner: userJane.id,
        content: "Reply Content",
        created_at: "2025-10-01T04:00:00.000Z",
        is_deleted: false,
      },
      {
        id: "reply-456",
        content: "Another Reply Content",
        owner: userJane.id,
        comment_id: comments[0].id,
        created_at: "2025-10-01T05:00:00.000Z",
        is_deleted: false,
      },
      {
        id: "reply-789",
        content: "Yet Another Reply Content",
        owner: userJohn.id,
        comment_id: comments[0].id,
        created_at: "2025-10-01T06:00:00.000Z",
        is_deleted: true,
      },
    ];

    const expectedThreadDetails = new ThreadDetails({
      id: "thread-123",
      title: "Thread Title",
      body: "Thread Body",
      date: "2025-10-01T00:00:00.000Z",
      username: "john_doe",
      comments: [
        new CommentDetails({
          id: "comment-123",
          content: "Comment Content",
          date: "2025-10-01T01:00:00.000Z",
          username: "john_doe",
          replies: [
            new CommentReplyDetails({
              id: "reply-123",
              content: "Reply Content",
              date: "2025-10-01T04:00:00.000Z",
              username: "jane_doe",
            }),
            new CommentReplyDetails({
              id: "reply-456",
              content: "Another Reply Content",
              date: "2025-10-01T05:00:00.000Z",
              username: "jane_doe",
            }),
            new CommentReplyDetails({
              id: "reply-789",
              content: "**balasan telah dihapus**",
              date: "2025-10-01T06:00:00.000Z",
              username: "john_doe",
            }),
          ],
        }),
        new CommentDetails({
          id: "comment-456",
          content: "Another Comment Content",
          date: "2025-10-01T02:00:00.000Z",
          username: "john_doe",
          replies: [],
        }),
        new CommentDetails({
          id: "comment-789",
          content: "Yet Another Comment Content",
          date: "2025-10-01T03:00:00.000Z",
          username: "john_doe",
          replies: [],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === userJohn.id) {
        return Promise.resolve(userJohn);
      }
      if (userId === userJane.id) {
        return Promise.resolve(userJane);
      }
    });
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockCommentReplyRepository.getCommentRepliesByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === comments[0].id) {
          return Promise.resolve(replies);
        }
        return Promise.resolve([]);
      });

    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    // Action
    const threadDetails = await getDetailsThreadUseCase.execute(mockThread.id);
    // Assert
    expect(threadDetails).toStrictEqual(expectedThreadDetails);

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(
      mockCommentReplyRepository.getCommentRepliesByCommentId
    ).toHaveBeenCalledWith("comment-123");
  });

  it("should orchestrating the get details thread action correctly if there no comments", async () => {
    // Arrange
    const userJohn = {
      id: "user-123",
      username: "john_doe",
      password: "secret_password",
      fullname: "John Doe",
    };
    const userJane = {
      id: "user-456",
      username: "jane_doe",
      password: "secret_password",
      fullname: "Jane Doe",
    };

    const mockThread = {
      id: "thread-123",
      owner: userJohn.id,
      title: "Thread Title",
      body: "Thread Body",
      created_at: "2025-10-01T00:00:00.000Z",
    };

    const comments = [];

    const expectedThreadDetails = new ThreadDetails({
      id: "thread-123",
      title: "Thread Title",
      body: "Thread Body",
      date: "2025-10-01T00:00:00.000Z",
      username: "john_doe",
      comments: [],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === userJohn.id) {
        return Promise.resolve(userJohn);
      }
      if (userId === userJane.id) {
        return Promise.resolve(userJane);
      }
    });
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comments));

    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    // Action
    const threadDetails = await getDetailsThreadUseCase.execute(mockThread.id);
    // Assert
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
    expect(threadDetails.comments).toHaveLength(0);

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("user-123");
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      "thread-123"
    );
  });
});
