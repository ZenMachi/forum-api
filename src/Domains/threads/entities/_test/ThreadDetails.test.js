const ThreadDetails = require("../ThreadDetails");

describe("ThreadDetails entities", () => {
  it("should throw error when payload doesnt contain needed property", () => {
    // Arrange
    const payload = {
      title: "thread title",
      body: "thread body",
      date: "2021-01-011a1",
      username: "thread username",
      comments: [],
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "thread-1234",
      title: "thread title",
      body: "thread body",
      date: "2021-01-011a1",
      username: "thread username",
      comments: "[]",
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload contain wrong data type", () => {
    // Arrange
    const payload = {
      id: "thread-1234",
      title: "thread title",
      body: "thread body",
      date: "2021-01-011a1",
      username: "thread username",
      comments: [],
    };

    // Action and Assert
    const threadDetails = new ThreadDetails(payload);
    expect(threadDetails.id).toEqual(payload.id);
    expect(threadDetails.title).toEqual(payload.title);
    expect(threadDetails.body).toEqual(payload.body);
    expect(threadDetails.date).toEqual(payload.date);
    expect(threadDetails.username).toEqual(payload.username);
    expect(threadDetails.comments).toEqual(payload.comments);
  });
});
