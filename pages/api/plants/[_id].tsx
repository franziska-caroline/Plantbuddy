import dbConnect from "../../../db/connect";
import Plant from "../../../db/models/plants";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  const { _id } = request.query;

  try {
    const plant = await Plant.findById(_id);
    if (!plant) {
      return response.status(404).json({ message: 'Plant not found' });
    }
    response.status(200).json(plant);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An error occurred while fetching the plant' });
  }
}
