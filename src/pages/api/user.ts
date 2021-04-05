import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../services/dbConnect";
import Rank from "../../models/Rank";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case "POST":
      try {
        const body = req.body;
        const headers = req.headers;
        const userToken = headers.authorization.split(" ")[1];
        const filter = { token: userToken };

        const user = await Rank.findOneAndUpdate(filter, body, {
          upsert: true,
          new: true
        });

        res.status(201).json({ success: true, user });
      } catch (error) {
        res.status(400).json({ success: false, errorMessage: 'Not was possible to create a new user' });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
