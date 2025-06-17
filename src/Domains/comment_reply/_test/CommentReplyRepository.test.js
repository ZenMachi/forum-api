const CommentReplyRepository = require("../CommentReplyRepository");

describe("CommentReplyRepository interface", () => {
  // Arrange
  const commentReplyRepository = new CommentReplyRepository();

  it("should throw error when invoke abstract addCommentReply method", async () => {
    // Action and Assert
    await expect(
      commentReplyRepository.addCommentReply({})
    ).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });

  it("should throw error when invoke abstract getCommentReplyById method", async () => {
    // Action and Assert
    await expect(
      commentReplyRepository.getCommentReplyById("")
    ).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });

  it("should throw error when invoke abstract getCommentRepliesByCommentId method", async () => {
    // Action and Assert
    await expect(
      commentReplyRepository.getCommentRepliesByCommentId("")
    ).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });

  it("should throw error when invoke abstract deleteCommentReply method", async () => {
    // Action and Assert
    await expect(
      commentReplyRepository.deleteCommentReply("", "", "", "")
    ).rejects.toThrowError("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
