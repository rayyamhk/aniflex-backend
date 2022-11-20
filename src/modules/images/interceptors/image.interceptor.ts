import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_MIMETYPE_REGEX, MAX_IMAGE_SIZE } from '../../../constants';

export const ImageIntersecptor = FileInterceptor('image', {
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIMETYPE_REGEX.test(file.mimetype)) {
      return cb(
        new UnsupportedMediaTypeException('Only jpeg/png/webp is accepted.'),
        false,
      );
    }
    if (Number(req.get('content-length')) > MAX_IMAGE_SIZE) {
      return cb(new PayloadTooLargeException('Image too large.'), false);
    }
    cb(null, true);
  },
});
