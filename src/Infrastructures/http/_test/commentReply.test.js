const pool = require("../../../Infrastructures/database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentReplyTableTestHelper = require("../../../../tests/CommentReplyTableTestHelper");

const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");

const container = require("../../container");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  const requestPayload = {
    content: "A Reply Content",
  };

  const commentPayload = {
    content: "A Comment Content",
  };

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
    await CommentReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /replies", () => {
    it("should response 201 and return reply correctly", async () => {
      const server = await createServer(container);

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
        addCommentOption(commentPayload, accessToken, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe("DELETE /replies/{replyId}", () => {
    it("should response 200", async () => {
      const server = await createServer(container);

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
        addCommentOption(commentPayload, accessToken, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      const reply = await injection(
        server,
        addCommentReplyOption(requestPayload, accessToken, threadId, commentId)
      );

      const {
        data: {
          addedReply: { id: replyId },
        },
      } = JSON.parse(reply.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
    it("should response 403 if not owner", async () => {
      const server = await createServer(container);

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
        addCommentOption(commentPayload, accessTokenOwner, threadId)
      );

      const {
        data: {
          addedComment: { id: commentId },
        },
      } = JSON.parse(comment.payload);

      const reply = await injection(
        server,
        addCommentReplyOption(
          requestPayload,
          accessTokenOwner,
          threadId,
          commentId
        )
      );

      const {
        data: {
          addedReply: { id: replyId },
        },
      } = JSON.parse(reply.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
