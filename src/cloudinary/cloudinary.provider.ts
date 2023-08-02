import { ConfigOptions } from 'cloudinary';
import cloudinary_config from '../config/cloudinary.config';
import { CLOUDINARY } from '../models/general.model';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => cloudinary_config,
};
