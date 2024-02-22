import dbConnect from "../../../db/connect";
import Entry from "../../../db/models/entries";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  if (request.method === "GET") {
    const entries = await Entry.find();
    response.status(200).json(entries);
  }

}