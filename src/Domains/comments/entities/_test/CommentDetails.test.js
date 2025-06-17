const CommentDetails = require("../CommentDetails");

describe("CommentDetails entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      username: "user-123",
      content: "comment content",
      username: "users-123",
      replies: [],
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      date: 123,
      username: 123,
      replies: "replies",
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("CommentDetails should be defined when payload is valid", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      date: "2025-01-01T00:00:00.000Z",
      username: "user-123",
      replies: [],
    };

    // Action
    const commentDetails = new CommentDetails(payload);

    // Assert
    expect(commentDetails.id).toEqual(payload.id);
    expect(commentDetails.content).toEqual(payload.content);
    expect(commentDetails.date).toEqual(payload.date);
    expect(commentDetails.username).toEqual(payload.username);
    expect(commentDetails.replies).toEqual(payload.replies);
  });
});
