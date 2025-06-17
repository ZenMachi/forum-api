const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");

describe("/threads/{threadId}/comments endpoint", () => {
  const threadPayload = {
    title: "A Thread Title",
    body: "A Thread Body",
  };

  const ownerPayload = {
    username: "dicoding",
    password: "secret",
    fullname: "Dicoding Indonesia",
  };

  const loginPayload = {
    username: "dicoding",
    password: "secret",
  };

  const notOwnerPayload = {
    username: "janedoe",
    password: "secretsecret",
    fullname: "Jane Doe",
  };

  const notOwnerLoginPayload = {
    username: "janedoe",
    password: "secretsecret",
  };

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /comments", () => {
    it("should response 201 and return added comment correctly", async () => {
      const server = await createServer(container);
      const requestPayload = {
        content: "A Comment Content",
      };

      await injection(server, addUserOption(ownerPayload));

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

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("DELETE /comments/{commentId}", () => {
    it("should response 200 and return deleted comment correctly", async () => {
      const server = await createServer(container);
      const requestPayload = {
        content: "A Comment Content",
      };

      await injection(server, addUserOption(ownerPayload));

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
        addCommentOption(requestPayload, accessToken, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 403 if user is not the owner of the comment", async () => {
      const server = await createServer(container);
      const requestPayload = {
        content: "A Comment Content",
      };

      await injection(server, addUserOption(ownerPayload));
      await injection(server, addUserOption(notOwnerPayload));

      const authOwner = await injection(server, addAuthOption(loginPayload));

      const authNotOwner = await injection(
        server,
        addAuthOption(notOwnerLoginPayload)
      );

      const {
        data: { accessToken: accessTokenOwner },
      } = JSON.parse(authOwner.payload);

      const {
        data: { accessToken: accessTokenNotOwner },
      } = JSON.parse(authNotOwner.payload);

      const thread = await injection(
        server,
        addThreadOption(threadPayload, accessTokenOwner)
      );

      const {
        data: {
          addedThread: { id: threadId },
        },
      } = JSON.parse(thread.payload);

      const comment = await injection(
        server,
        addCommentOption(requestPayload, accessTokenOwner, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessTokenNotOwner}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
