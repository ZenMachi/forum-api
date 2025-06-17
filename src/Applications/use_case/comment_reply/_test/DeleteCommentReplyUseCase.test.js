const CommentReplyRepository = require("../../../../Domains/comment_reply/CommentReplyRepository");
const OwnerValidator = require("../../../security/OwnerValidator");
const DeleteCommentReplyUseCase = require("../DeleteCommentReplyUseCase");

describe("DeleteCommentReplyUseCase", () => {
  it("should orchestrate delete comment reply action correctly", async () => {
    const commentReplyId = "comment-reply-123";
    const commentId = "comment-123";
    const threadId = "thread-123";
    const credential = "user-123";

    const commentReplyAvailable = {
      id: commentReplyId,
      thread_id: threadId,
      comment_id: commentId,
      owner: credential,
      content: "Comment Reply Content",
      created_at: "2025-10-01T01:00:00.000Z",
      is_deleted: false,
    };

    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockOwnerValidator = new OwnerValidator();

    mockCommentReplyRepository.getCommentReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentReplyAvailable));

    mockOwnerValidator.validateOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.deleteCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      ownerValidator: mockOwnerValidator,
    });

    await deleteCommentReplyUseCase.execute(
      commentReplyId,
      threadId,
      commentId,
      credential
    );

    expect(mockCommentReplyRepository.getCommentReplyById).toHaveBeenCalledWith(
      "comment-reply-123"
    );
    expect(mockOwnerValidator.validateOwner).toHaveBeenCalledWith(
      "user-123",
      "user-123",
      "comment reply"
    );
    expect(mockCommentReplyRepository.deleteCommentReply).toHaveBeenCalledWith(
      "comment-reply-123",
      "thread-123",
      "comment-123",
      "user-123"
    );
  });
});
