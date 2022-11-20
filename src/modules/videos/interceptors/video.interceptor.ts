import * as crypto from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MAX_VIDEO_SIZE, VIDEO_MIMETYPE_REGEX } from '../../../constants';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => cb(null, 'temp/'),
    filename: (req, file, cb) => {
      const name = crypto.randomBytes(8).toString('hex');
      const ext = path.parse(file.originalname).ext;
      cb(null, name + ext);

      // https://github.com/expressjs/multer/issues/259#issuecomment-691748926
      req.on('aborted', () => {
        const filePath = path.join('temp', name + ext);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    },
  }),
  /**
   * reject requests in "fileFilter" instead of "limit",
   * because requests here are sent without body. (Why?)
   * TODO: fix the "file" type in nestjs repo.
   */
  fileFilter: (req, file, cb) => {
    if (!VIDEO_MIMETYPE_REGEX.test(file.mimetype)) {
      return cb(
        new UnsupportedMediaTypeException('Only mp4 is accepted.'),
        false,
      );
    }
    if (Number(req.get('content-length')) > MAX_VIDEO_SIZE) {
      return cb(new PayloadTooLargeException('Video too large.'), false);
    }
    cb(null, true);
  },
};

export const VideoInterceptor = FileInterceptor('video', multerConfig);
