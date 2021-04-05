import http, { IncomingMessage, ServerResponse } from "http";
import request from "supertest";

import { apiResolver } from "next/dist/next-server/server/api-utils";
import handler from "../../../../src/pages/api/rank";

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

describe("API Rank", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("Should return the list of users of rank", async () => {
    let newMockRankData = mockRankData.sort((a, b) => b.experience - a.experience);
    let RankMock = jest.spyOn(Rank, "find");

    RankMock.mockImplementation(() => {
      return Promise.resolve(newMockRankData);
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .get("/")
      .then(function (res) {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          success: true,
          rankOfUsers: newMockRankData,
        });
        expect(RankMock).toHaveBeenCalled();
      });
  });

  it("Should not return the list of users of rank", async () => {
    let RankMock = jest.spyOn(Rank, "find");

    RankMock.mockImplementation(() => {
      return Promise.reject();
    });

    const requestListener = (req: IncomingMessage, res: ServerResponse) => {
      apiResolver(req, res, undefined, handler, {} as any, undefined);
    };

    const server = http.createServer(requestListener);
    await request
      .agent(server)
      .get("/")
      .then(function (res) {
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          errorMessage: 'Not was possible return of list of rank'
        });
        expect(RankMock).toHaveBeenCalled();
      });
  });
});
