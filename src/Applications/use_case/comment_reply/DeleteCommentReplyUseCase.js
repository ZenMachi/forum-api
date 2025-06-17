class DeleteCommentReplyUseCase {
  constructor({ commentReplyRepository, ownerValidator }) {
    this._commentReplyRepository = commentReplyRepository;
    this._ownerValidator = ownerValidator;
  }

  async execute(
    useCaseCommentReplyId,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    const commentReply = await this._commentReplyRepository.getCommentReplyById(
      useCaseCommentReplyId
    );

    await this._ownerValidator.validateOwner(
      useCaseCredential,
      commentReply.owner,
      "comment reply"
    );

    await this._commentReplyRepository.deleteCommentReply(
      commentReply.id,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentReplyUseCase;
