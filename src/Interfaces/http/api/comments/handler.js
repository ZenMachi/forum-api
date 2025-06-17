const AddCommentUseCase = require("../../../../Applications/use_case/comments/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/comments/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { threadId } = req.params;
    const { id: owner } = req.auth.credentials;
    const addedComment = await addCommentUseCase.execute(
      req.payload,
      threadId,
      owner
    );
    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(req, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id: owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    await deleteCommentUseCase.execute(commentId, threadId, owner);

    return h.response({
      status: "success",
    });
  }
}

module.exports = CommentsHandler;
