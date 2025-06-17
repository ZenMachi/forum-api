const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const AddComment = require("../../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../../Domains/comments/entities/AddedComment");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "This is a comment",
    };
    const mockUserResult = {
      id: "user-123",
      username: "dicoding",
      password: "secret_password",
      fullname: "Dicoding Indonesia",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: mockUserResult.id,
    });
    const mockThreadResult = {
      id: "thread-123",
      owner: mockUserResult.id,
      title: "Thread Title",
      body: "Thread Body",
      created_at: "2025-10-01T00:00:00.000Z",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadResult));
    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUserResult));
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      mockThreadResult.id,
      mockUserResult.id
    );

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: mockUserResult.id,
      })
    );

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith("user-123");
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new AddComment({
        content: "This is a comment",
      }).content,
      "thread-123",
      "user-123"
    );
  });
});
