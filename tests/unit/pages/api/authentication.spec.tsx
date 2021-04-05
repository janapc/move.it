import http, { IncomingMessage, ServerResponse } from "http";
import request from "supertest";
import jwt from "jsonwebtoken";

import { apiResolver } from "next/dist/next-server/server/api-utils";
import handler from "../../../../src/pages/api/authentication";

jest.mock("jsonwebtoken");

describe("API Authentication", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("Should authenticate the user", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      return Promise.resolve();
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .get("/")
      .set("authorization", "Bearer banana123")
      .then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          success: true,
        });
        expect(jwt.verify).toHaveBeenCalled();
        expect(jwt.verify).toHaveBeenCalledWith(
          "banana123",
          process.env.SECRET_TOKEN
        );
      });
  });

  it("Should not authenticate the user", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Not user authentication");
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .get("/")
      .set("authorization", "Bearer banana12s3")
      .then(function (res) {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          errorMessage: "The user is not authenticated",
        });
      });
  });

  it("Should create a new token and return this token", async () => {
    let body = {
      username: "banana123",
      nodeid: "asodinek1",
      avatar: "",
      userid: "1",
    };

    jest.spyOn(jwt, "sign").mockImplementation(() => {
      return "banana123banana321";
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .post("/")
      .send({
        username: "banana123",
        nodeid: "asodinek1",
        avatar: "",
        userid: "1",
      })
      .then(function (res) {
        expect(res.status).toEqual(201);
        expect(res.body).toEqual({
          success: true,
          token: "banana123banana321",
        });
        expect(jwt.sign).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalledWith(body, process.env.SECRET_TOKEN);
      });
  });

  it("Should not create a new token", async () => {
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("Not user authentication");
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .post("/")
      .send({
        username: "banana123",
        nodeid: "asodinek1",
        avatar: "",
        userid: "1",
      })
      .then(function (res) {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          errorMessage: "The user not can it authenticate",
        });
      });
  });
});
