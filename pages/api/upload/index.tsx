import formidable from "formidable";
import cloudinary from "cloudinary";
import { NextApiRequest, NextApiResponse } from 'next';


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
    response.status(400).json({ message: "Method not allowed" });
    return;
  }

  const form = formidable();

  form.parse(request, async (error: string, _fields: formidable.Fields, files: formidable.Files) => {
    if (error) {
      console.error("Formidable parse error:", error);
      response.status(500).json({ error: "Formidable parse error" });
      return;
    }

    const file = files.plantbuddyImage as formidable.File[];

    try {
      const image = await cloudinary.v2.uploader.upload(file[0].filepath, {
        folder: '',
      });
      response.status(200).json(image);
    } catch (cloudinaryError) {
      console.error(cloudinaryError);
      console.error("Cloudinary upload error:", cloudinaryError);
      response.status(500).json({ error: "Cloudinary upload error" });
    }
  });
}
