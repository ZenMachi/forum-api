const AddComment = require("../../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, userCaseThreadId, useCaseCredential) {
    const { content } = new AddComment(useCasePayload);
    const thread = await this._threadRepository.getThreadById(userCaseThreadId);
    const user = await this._userRepository.getUserById(useCaseCredential);

    return await this._commentRepository.addComment(
      content,
      thread.id,
      user.id
    );
  }
}

module.exports = AddCommentUseCase;
