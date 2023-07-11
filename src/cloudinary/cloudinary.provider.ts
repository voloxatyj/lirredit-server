import { ConfigOptions } from 'cloudinary';
import cloudinary_config from '../config/cloudinary.config';
import { CLOUDINARY } from '../utils/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => cloudinary_config,
};
