import dbConnect from "../../../db/connect";
import Category from "../../../db/models/categories";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();

  if (request.method === "GET") {
    const categories = await Category.find();
    response.status(200).json(categories);
  }

}
