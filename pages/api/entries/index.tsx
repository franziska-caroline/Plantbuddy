import dbConnect from "../../../db/connect";
import Entry from "../../../db/models/entries";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await dbConnect();

  const session = await getSession({ req: request });

  if (request.method === "GET") {
    try {
      const entries = await Entry.find({ benutzerEmail: session?.user?.email });
      response.status(200).json(entries);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (request.method === "POST") {
    try {
      const entryData = request.body;
      const newEntry = new Entry(entryData);

      await newEntry.save();

      response.status(201).json({ status: "Entry created" });
    } catch (error) {
      console.error(error);
      response.status(400).json({ message: "Bad request" });
    }
  }
}
