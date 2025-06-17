const AddThreadUseCase = require("../../../../Applications/use_case/threads/AddThreadUseCase");
const GetDetailsThreadUseCase = require("../../../../Applications/use_case/threads/GetDetailsThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(req, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = req.auth.credentials;
    const addedThread = await addThreadUseCase.execute(req.payload, userId);
    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);

    return response;
  }

  async getThreadDetailsHandler(req, h) {
    const getDetailsThreadUseCase = this._container.getInstance(
      GetDetailsThreadUseCase.name
    );
    const { threadId } = req.params;
    const detailsThread = await getDetailsThreadUseCase.execute(threadId);
    const response = h.response({
      status: "success",
      data: {
        thread: detailsThread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
