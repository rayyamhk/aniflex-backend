import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { Injectable, NotFoundException } from '@nestjs/common';

const execAsync = util.promisify(exec);

@Injectable()
export class ChunksService {
  getVideoPath(id: string, episode: number) {
    return `/public/videos/${id}/${episode}/video.mpd`;
  }

  async prepareEnvironment(
    id: string,
    episode: number,
    video: Express.Multer.File,
  ) {
    try {
      const outputPath = path.join('static', 'videos', id, episode.toString());
      if (fs.existsSync(outputPath)) {
        await fs.promises.rm(outputPath, { recursive: true });
      }
      await fs.promises.mkdir(outputPath, { recursive: true });
    } catch (err) {
      fs.promises.unlink(video.path); // clean up the video in temp directory.
      throw err;
    }
  }

  async processVideo(id: string, episode: number, video: Express.Multer.File) {
    try {
      const outputPath = path.join('static', 'videos', id, episode.toString());
      await execAsync(`
        ffmpeg \
          -i ${video.path} \
          -c:v libx264 -preset medium -tune animation -crf 26 \
          -init_seg_name \\$RepresentationID\\$_000.\\$ext\\$ -media_seg_name \\$RepresentationID\\$_\\$Number%03d\\$.\\$ext\\$ \
          -use_template 1 -use_timeline 1 \
          -seg_duration 15 -adaptation_sets "id=0,streams=v id=1,streams=a" \
          -f dash ${outputPath}/video.mpd
      `);
    } catch (err) {
      // Since this method is not called with "await", don't throw the error coz
      // it won't be caught by the error handling layer provided by nestjs.
      console.error(err);
    } finally {
      fs.promises.unlink(video.path); // clean up the video in temp
    }
  }

  async deleteChunks(id: string, episode: number) {
    const outputPath = path.join('static', 'videos', id, episode.toString());
    if (!fs.existsSync(path.join(outputPath, 'video.mpd'))) {
      throw new NotFoundException(
        `Video not found (id: ${id}, episode: ${episode})`,
      );
    }
    await fs.promises.rm(outputPath, { recursive: true });
  }
}
