import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../services/dbConnect";
import Rank from "../../models/Rank";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const result = await Rank.find({}, null, { sort: { experience: "desc" } });

        res.status(200).json({ success: true, rankOfUsers: result });
      } catch (error) {
        res.status(400).json({ success: false, errorMessage: 'Not was possible return of list of rank' });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
