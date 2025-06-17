const AddedThread = require("../AddedThread");

describe("AddedThread entities", () => {
  it("should throw error when payload doesnt contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-1234",
      title: "thread title",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "thread-1234",
      title: "thread title",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-1234",
      title: "thread title",
      owner: "user-123",
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
