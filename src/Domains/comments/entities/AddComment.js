class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  _verifyPayload(payload) {
    const { content } = payload;

    if (!content) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (content.trim().length === 0) {
      throw new Error("ADD_COMMENT.CANNOT_BE_EMPTY_STRING");
    }
  }
}

module.exports = AddComment;
