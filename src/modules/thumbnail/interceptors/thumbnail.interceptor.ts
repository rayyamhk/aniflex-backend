import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const ThumbnailInterceptor = FileInterceptor('thumbnail', {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg') {
      return cb(
        new UnsupportedMediaTypeException('Only jpeg is accepted.'),
        false,
      );
    }
    if (Number(req.get('content-length')) > 1024 * 1024 * 3) {
      return cb(
        new PayloadTooLargeException('Only image less than 3MB is accepted.'),
        false,
      );
    }
    cb(null, true);
  },
});
