import type { NextApiRequest, NextApiResponse } from "next";

import jwt from "jsonwebtoken";

type Body = {
  username: string;
  nodeid: string;
  avatar: string;
  userid: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const headers = req.headers;
        const userToken = headers.authorization.split(" ")[1]; // authorization of type Bearer

        jwt.verify(userToken, process.env.SECRET_TOKEN);

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({
          success: false,
          errorMessage: "The user is not authenticated",
        });
      }
      break;
    case "POST":
      try {
        const body: Body = req.body;
        const token = jwt.sign(body, process.env.SECRET_TOKEN);

        res.status(201).json({ success: true, token });
      } catch (error) {
        res.status(400).json({
          success: false,
          errorMessage: "The user not can it authenticate",
        });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
