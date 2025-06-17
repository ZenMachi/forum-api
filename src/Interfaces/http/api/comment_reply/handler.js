const DeleteCommentReplyUseCase = require("../../../../Applications/use_case/comment_reply/DeleteCommentReplyUseCase");
const AddCommentReplyUseCase = require("../../../../Applications/use_case/comment_reply/AddCommentReplyUseCase");

class CommentReplyHandler {
  constructor(container) {
    this._container = container;
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(req, h) {
    const addCommentReplyUseCase = this._container.getInstance(
      AddCommentReplyUseCase.name
    );
    const { threadId, commentId } = req.params;
    const { id: owner } = req.auth.credentials;
    const addedCommentReply = await addCommentReplyUseCase.execute(
      req.payload,
      threadId,
      commentId,
      owner
    );
    const response = h.response({
      status: "success",
      data: {
        addedReply: addedCommentReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(req, h) {
    const deleteCommentReplyUseCase = this._container.getInstance(
      DeleteCommentReplyUseCase.name
    );
    const { id: owner } = req.auth.credentials;
    const { threadId, commentId, commentReplyId } = req.params;
    await deleteCommentReplyUseCase.execute(
      commentReplyId,
      threadId,
      commentId,
      owner
    );

    return h.response({
      status: "success",
    });
  }
}

module.exports = CommentReplyHandler;
