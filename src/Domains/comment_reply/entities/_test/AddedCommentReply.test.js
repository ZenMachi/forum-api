const AddedCommentReply = require("../AddedCommentReply");

describe("AddedCommentReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      author: "comment content",
      user: "users-123",
    };

    // Action and Assert
    expect(() => new AddedCommentReply(payload)).toThrowError(
      "ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedCommentReply(payload)).toThrowError(
      "ADDED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedCommentReply object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      owner: "users-123",
    };

    // Action
    const addedCommentReply = new AddedCommentReply(payload);

    // Assert
    expect(addedCommentReply.id).toEqual(payload.id);
    expect(addedCommentReply.content).toEqual(payload.content);
    expect(addedCommentReply.owner).toEqual(payload.owner);
  });
});
