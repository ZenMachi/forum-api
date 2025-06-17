const ThreadDetails = require("../../../Domains/threads/entities/ThreadDetails");
const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");
const CommentReplyDetails = require("../../../Domains/comment_reply/entities/CommentReplyDetails");

class GetDetailsThreadUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    commentReplyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCaseThreadId) {
    const thread = await this._threadRepository.getThreadById(useCaseThreadId);
    const { username: threadUsername } = await this._userRepository.getUserById(
      thread.owner
    );

    const threadDetails = new ThreadDetails({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at.toString(),
      username: threadUsername,
      comments: [],
    });

    const commentsThread = await this._commentRepository.getCommentsByThreadId(
      thread.id
    );

    if (commentsThread.length > 0) {
      for (const comment of commentsThread) {
        const { username: commentUsername } =
          await this._userRepository.getUserById(comment.owner);
        const commentDetails = new CommentDetails({
          id: comment.id,
          content: comment.is_deleted
            ? "**komentar telah dihapus**"
            : comment.content,
          date: comment.created_at.toString(),
          username: commentUsername,
          replies: [],
        });

        const repliesComment =
          await this._commentReplyRepository.getCommentRepliesByCommentId(
            comment.id
          );

        if (repliesComment.length > 0) {
          for (const reply of repliesComment) {
            const { username: replyUsername } =
              await this._userRepository.getUserById(reply.owner);
            const replyDetails = new CommentReplyDetails({
              id: reply.id,
              content: reply.is_deleted
                ? "**balasan telah dihapus**"
                : reply.content,
              date: reply.created_at.toString(),
              username: replyUsername,
            });
            commentDetails.replies.push(replyDetails);
          }
        }

        threadDetails.comments.push(commentDetails);
      }
    }
    return threadDetails;
  }
}

module.exports = GetDetailsThreadUseCase;
