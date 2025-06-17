const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const OwnerValidator = require("../../../security/OwnerValidator");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const useCaseCredential = "user-123";
    const useCaseThreadId = "thread-123";
    const useCaseCommentId = "comment-123";

    const comment = {
      id: useCaseCommentId,
      thread_id: useCaseThreadId,
      owner: useCaseCredential,
      content: "Comment Content",
      created_at: "2025-10-01T01:00:00.000Z",
      is_deleted: false,
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockOwnerValidator = new OwnerValidator();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comment));
    mockOwnerValidator.validateOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      ownerValidator: mockOwnerValidator,
    });

    // Action
    await deleteCommentUseCase.execute(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(
      "comment-123"
    );
    expect(mockOwnerValidator.validateOwner).toBeCalledWith(
      "user-123",
      "user-123",
      "comment"
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      "comment-123",
      "thread-123",
      "user-123"
    );
  });
});
