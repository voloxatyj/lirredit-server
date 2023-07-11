import { v2 as cloudinary } from 'cloudinary';
import * as process from 'process';

export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

