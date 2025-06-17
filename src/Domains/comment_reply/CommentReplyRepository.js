class CommentReplyRepository {
  async addCommentReply(content, commentId, threadId, ownerId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async getCommentReplyById(id) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getCommentRepliesByCommentId(commentId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteCommentReply(commentReplyId, threadId, commentId, ownerId) {
    throw new Error("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentReplyRepository;
