import * as crypto from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UUID_REGEX } from '../../../constants';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => cb(null, 'temp/'),
    filename: (req, file, cb) => {
      const name = crypto.randomBytes(16).toString('hex');
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
    const id = req.get('anime-id') as string;
    const episode = req.get('anime-episode') as string;
    const method = req.method as string;
    if (
      !id ||
      !UUID_REGEX.test(id) ||
      !episode ||
      !Number.isInteger(Number(episode)) ||
      Number(episode) <= 0
    ) {
      return cb(
        new BadRequestException(
          'Anime-ID (UUIDv4) and Anime-Episode (positive integer) must be provided in header.',
        ),
      );
    }
    const isVideoExisted = fs.existsSync(
      path.join('static', 'videos', id, episode, 'video.mpd'),
    );
    if (method === 'POST' && isVideoExisted) {
      return cb(
        new ConflictException(`Video existed (id: ${id}, episode: ${episode})`),
      );
    }
    if (method === 'PUT' && !isVideoExisted) {
      return cb(
        new NotFoundException(
          `Video not existed (id: ${id}, episode: ${episode})`,
        ),
      );
    }
    if (file.mimetype !== 'video/mp4') {
      return cb(
        new UnsupportedMediaTypeException('Only mp4 is accepted.'),
        false,
      );
    }
    if (Number(req.get('content-length')) > 1024 * 1024 * 1024 * 5) {
      return cb(
        new PayloadTooLargeException('Only video less than 5GB is accepted.'),
        false,
      );
    }
    cb(null, true);
  },
};

export const VideoInterceptor = FileInterceptor('video', multerConfig);
