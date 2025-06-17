const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "user-123",
      title: "comment title",
      user: "users-123",
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
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
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "comment content",
      owner: "users-123",
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
