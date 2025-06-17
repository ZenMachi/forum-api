class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, replies } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    const { id, content, date, username, replies } = payload;

    if (!id || !content || !date || !username || !replies) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      !Array.isArray(replies)
    ) {
      throw new Error("COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentDetails;
