import http, { IncomingMessage, ServerResponse } from "http";
import request from "supertest";

import { apiResolver } from "next/dist/next-server/server/api-utils";
import handler from "../../../../src/pages/api/user";

jest.mock("../../../../src/services/dbConnect");

import Rank from "../../../../src/models/Rank";

const mockRankData = [
  {
    username: "Banana",
    _id: "banana123",
    level: 1,
    experience: 50,
    avatar: "",
    challenges: 1,
    twitterToken: "",
    token: "banana123",
  },
  {
    username: "test",
    _id: "123",
    level: 2,
    experience: 150,
    avatar: "",
    challenges: 3,
    twitterToken: "",
    token: "test123",
  },
];

describe("API User", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("Should save or update a user", async () => {
    let RankMock = jest.spyOn(Rank, "findOneAndUpdate");

    RankMock.mockImplementation((filter, body) => {
      let findOne = mockRankData.find((data) => data.token === filter.token);
      if (findOne) {
        return Promise.resolve({ ...findOne, ...body });
      } else return Promise.reject();
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .post("/")
      .set("authorization", "Bearer banana123")
      .send({
        level: 3,
        experience: 200,
      })
      .then(function (res) {
        expect(res.status).toEqual(201);
        expect(res.body).toEqual({
          success: true,
          user: {
            username: "Banana",
            _id: "banana123",
            level: 3,
            experience: 200,
            avatar: "",
            challenges: 1,
            twitterToken: "",
            token: "banana123",
          },
        });
        expect(RankMock).toHaveBeenCalled();
      });
  });

  it("Should not save or update a user", async () => {
    let RankMock = jest.spyOn(Rank, "findOneAndUpdate");

    RankMock.mockImplementation((filter, body) => {
      let findOne = mockRankData.find((data) => data.token === filter.token);
      if (findOne) {
        return Promise.resolve({ ...findOne, ...body });
      } else return Promise.reject();
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .post("/")
      .set("authorization", "Bearer banana1234")
      .send({
        level: 3,
        experience: 200,
      })
      .then(function (res) {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ success: false, errorMessage: 'Not was possible to create a new user' });
        expect(RankMock).toHaveBeenCalled();
      });
  });
});
