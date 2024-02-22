import dbConnect from "../../../db/connect";
import Entry from "../../../db/models/entries";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  if (request.method === "GET") {
    const entries = await Entry.find();
    response.status(200).json(entries);
  }

  if (request.method === "POST") {
    try {
      const entryData = request.body;
      await Entry.create(entryData);

      response.status(201).json({ status: "Place created" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ message: "Bad request" });
    }
  }

}