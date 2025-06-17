class DeleteCommentUseCase {
  constructor({ commentRepository, ownerValidator }) {
    this._commentRepository = commentRepository;
    this._ownerValidator = ownerValidator;
  }

  async execute(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );

    await this._ownerValidator.validateOwner(
      useCaseCredential,
      comment.owner,
      "comment"
    );

    await this._commentRepository.deleteComment(
      comment.id,
      useCaseThreadId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentUseCase;
