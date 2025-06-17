const AddComment = require("../AddComment");

describe("a AddComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 777,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload is empty", () => {
    // Arrange
    const payload = {
      content: "  ",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.CANNOT_BE_EMPTY_STRING"
    );
  });

  it("should create AddComment object correctly", () => {
    // Arrange
    const payload = {
      content: "comment content",
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
  });
});
