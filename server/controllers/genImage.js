import dotenv from 'dotenv';
import OpenAI from 'openai';
import aws from 'aws-sdk';
import axios from 'axios';

dotenv.config();

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const imageGenerate= async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    // Generate the image with OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image_url = response.data[0].url;
    const imageResponse = await axios.get(image_url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
    const uniqueFilename = `generated-image-${Date.now()}.png`;
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      Body: imageBuffer,
      ContentType: 'image/png',
    };

    const s3Response = await s3.putObject(s3Params).promise();

    const s3Location = `https://s3.${process.env.REGION}.amazonaws.com/${BUCKET_NAME}/${uniqueFilename}`;
    res.json({
      message: 'Image generated and uploaded successfully.',
      location: s3Location,
    });
  } catch (error) {
    console.error('Error generating or uploading image:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};
