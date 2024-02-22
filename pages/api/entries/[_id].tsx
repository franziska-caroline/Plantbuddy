import dbConnect from "../../../db/connect";
import Entry from "../../../db/models/entries";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  const { _id } = request.query;

 try {
    const entry = await Entry.findById(_id);
    if (!entry) {
      return response.status(404).json({ message: "Entry not found" });
    }
    response.status(200).json(entry);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "An error occurred while fetching the entry" });
  }
}



