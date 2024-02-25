import dbConnect from "../../../db/connect";
import Entry from "../../../db/models/entries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await dbConnect();

  const { _id } = request.query;

  try {
    if (request.method === "GET") {
      const entry = await Entry.findById(_id);
      if (!entry) {
        return response.status(404).json({ message: "Entry not found" });
      }
      response.status(200).json(entry);
    }

    if (request.method === "PUT") {
      const updateEntry = request.body;
      await Entry.findByIdAndUpdate(_id, updateEntry);
      response.status(200).json({ status: `Entry ${_id} updated!` });
      return;
    }

    if (request.method === "DELETE") {
      await Entry.findByIdAndDelete(_id);
      response.status(200).json({ status: "Item deleted" });
      return;
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An error occurred while fetching the entry" });
  }
}
