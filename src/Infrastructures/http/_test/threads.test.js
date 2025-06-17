const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");

const createServer = require("../createServer");
const container = require("../../container");
const pool = require("../../../Infrastructures/database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

describe("/threads endpoint", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /threads", () => {
    it("should response 201 and return thread correctly", async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: "A Thread Title",
        body: "A Thread Body",
      };

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const loginData = {
        username: "dicoding",
        password: "secret",
      };

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginData,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
    });

    it("should response 401 if not authenticated", async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: "A Thread Title",
        body: "A Thread Body",
      };
      const falseToken = "falseToken";

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${falseToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });

    it("should response 400 if payload not contain title or body", async () => {
      const server = await createServer(container);
      const requestPayload = {
        title: "A Thread Title",
      };

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const loginData = {
        username: "dicoding",
        password: "secret",
      };

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginData,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 if payload not meet data type specification", async () => {
      const payload = {
        title: 123,
        body: "A Thread Body",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          password: "secret",
          fullname: "Dicoding Indonesia",
        },
      });

      const loginData = {
        username: "dicoding",
        password: "secret",
      };

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginData,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });
  });

  describe("GET /threads/{threadId}", () => {
    it("should response 200 and return thread detail", async () => {
      const commentPayload = {
        content: "A Comment Content",
      };

      const threadPayload = {
        title: "A Thread Title",
        body: "A Thread Body",
      };

      const userPayload = {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };

      const loginPayload = {
        username: "dicoding",
        password: "secret",
      };

      const replyPayload = {
        content: "A Reply Content",
      };

      const mockthreadDetails = {};

      const server = await createServer(container);

      await injection(server, addUserOption(userPayload));

      const auth = await injection(server, addAuthOption(loginPayload));
      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await injection(
        server,
        addThreadOption(threadPayload, accessToken)
      );

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(thread.payload);

      const comment = await injection(
        server,
        addCommentOption(commentPayload, accessToken, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      await injection(
        server,
        addCommentReplyOption(replyPayload, accessToken, threadId, commentId)
      );

      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toEqual(
        expect.objectContaining(mockthreadDetails)
      );
    });
  });
});
