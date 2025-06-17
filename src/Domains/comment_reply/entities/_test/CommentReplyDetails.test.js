const CommentReplyDetails = require("../CommentReplyDetails");

describe("CommentReplyDetails entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new CommentReplyDetails(payload)).toThrowError(
      "COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      date: 123,
      username: 123,
    };

    // Action and Assert
    expect(() => new CommentReplyDetails(payload)).toThrowError(
      "COMMENT_REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("CommentReplyDetails should be defined when payload is valid", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      date: "2021-01-01",
      username: "user-123",
    };

    // Action
    const commentReplyDetails = new CommentReplyDetails(payload);

    // Assert
    expect(commentReplyDetails.id).toEqual(payload.id);
    expect(commentReplyDetails.content).toEqual(payload.content);
    expect(commentReplyDetails.date).toEqual(payload.date);
    expect(commentReplyDetails.username).toEqual(payload.username);
  });
});
