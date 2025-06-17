const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when payload doesnt contain needed property", () => {
    // Arrange
    const payload = {
      title: "thread title",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "thread title",
      body: 123,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when title length more than 100 characters", () => {
    // Arrange
    const payload = {
      title: "a".repeat(101),
      body: "thread body",
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.TITLE_EXCEED_CHAR_LIMIT"
    );
  });

  it("should create addThread object correctly", () => {
    // Arrange
    const payload = {
      title: "thread title",
      body: "thread body",
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});
