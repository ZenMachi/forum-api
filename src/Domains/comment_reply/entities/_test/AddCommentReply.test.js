const AddCommentReply = require("../AddCommentReply");

describe("a AddCommentReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddCommentReply(payload)).toThrowError(
      "ADD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 777,
    };

    // Action and Assert
    expect(() => new AddCommentReply(payload)).toThrowError(
      "ADD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload is empty", () => {
    // Arrange
    const payload = {
      content: "  ",
    };

    // Action and Assert
    expect(() => new AddCommentReply(payload)).toThrowError(
      "ADD_COMMENT_REPLY.CANNOT_BE_EMPTY_STRING"
    );
  });

  it("should create addCommentReply object correctly", () => {
    // Arrange
    const payload = {
      content: "comment reply content",
    };

    // Action
    const addCommentReply = new AddCommentReply(payload);

    // Assert
    expect(addCommentReply.content).toEqual(payload.content);
  });
});
