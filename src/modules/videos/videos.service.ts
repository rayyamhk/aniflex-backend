import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

const execAsync = util.promisify(exec);

@Injectable()
export class VideosService {
  constructor(private readonly storageService: StorageService) {}

  async create(key: string, video: Express.Multer.File) {
    await this.processVideo(key, video);
    await this.uploadVideoChunks(key);
  }

  async delete(key: string) {
    await this.storageService.deleteDir(key);
  }

  private async processVideo(key: string, video: Express.Multer.File) {
    const outputPath = path.join('temp', key);
    try {
      await fs.promises.mkdir(outputPath, { recursive: true });
      await execAsync(`
        ffmpeg \
          -i ${video.path} \
          -c:v libx264 -preset veryfast -tune animation -crf 26 \
          -f hls \
          -hls_time 30 \
          -hls_list_size 0 \
          -hls_segment_filename 'temp/${key}/%d.ts' \
          temp/${key}/out.m3u8
      `);
    } catch (err) {
      console.error(err);
      await fs.promises.rm(outputPath, { recursive: true, force: true });
    } finally {
      await fs.promises.rm(video.path, { force: true });
    }
  }

  private async uploadVideoChunks(key: string) {
    const chunksPath = path.join('temp', key);
    try {
      const dir = await fs.promises.readdir(chunksPath);
      for (const filename of dir) {
        const buffer = await fs.promises.readFile(
          path.join(chunksPath, filename),
        );
        const mimetype =
          path.parse(filename).ext === '.m3u8'
            ? 'application/x-mpegurl'
            : 'video/mp2t';
        await this.storageService.put(`${key}/${filename}`, buffer, mimetype);
      }
    } catch (err) {
      console.error(err);
    } finally {
      await fs.promises.rm(chunksPath, { recursive: true, force: true });
    }
  }
}
