import dbConnect from "../../../db/connect";
import Plant from "../../../db/models/plants";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  if (request.method === "GET") {
    const plants = await Plant.find();
    response.status(200).json(plants);
  }

}
