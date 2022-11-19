import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_MIMETYPE_REGEX } from '../../../constants';

const MAX_SIZE = 1024 * 1024 * 1; // 1MB

export const ImageIntersecptor = FileInterceptor('image', {
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIMETYPE_REGEX.test(file.mimetype)) {
      return cb(
        new UnsupportedMediaTypeException('Only jpeg/png/webp is accepted.'),
        false,
      );
    }
    if (Number(req.get('content-length')) > MAX_SIZE) {
      return cb(
        new PayloadTooLargeException('Only image less than 1MB is accepted.'),
        false,
      );
    }
    cb(null, true);
  },
});
