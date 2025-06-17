const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../../Domains/threads/entities/AddThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "Thread Title",
      body: "Thread Body",
    };
    const useCaseCredential = {
      id: "user-123",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: useCasePayload.title,
      owner: useCaseCredential.id,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      useCaseCredential
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: "thread-123",
        title: "Thread Title",
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new AddThread({
        title: "Thread Title",
        body: "Thread Body",
      }),
      {
        id: "user-123",
      }
    );
  });
});
