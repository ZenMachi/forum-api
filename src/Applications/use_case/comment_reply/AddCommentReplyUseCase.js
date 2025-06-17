const AddCommentReply = require("../../../Domains/comment_reply/entities/AddCommentReply");

class AddCommentReplyUseCase {
  constructor({
    commentReplyRepository,
    commentRepository,
    threadRepository,
    userRepository,
  }) {
    this._commentReplyRepository = commentReplyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(
    useCasePayload,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    const { content } = new AddCommentReply(useCasePayload);
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );
    const thread = await this._threadRepository.getThreadById(useCaseThreadId);
    const user = await this._userRepository.getUserById(useCaseCredential);

    return await this._commentReplyRepository.addCommentReply(
      content,
      comment.id,
      thread.id,
      user.id
    );
  }
}

module.exports = AddCommentReplyUseCase;
