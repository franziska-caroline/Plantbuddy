import dbConnect from "../../../db/connect";
import Category from "../../../db/models/categories";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  await dbConnect();
  
  const { slug } = request.query;

  const category = await Category.findOne({ slug });

  if (!category) {
    return response.status(404).json({ message: 'Category not found' });
  }

  response.status(200).json(category);
}
