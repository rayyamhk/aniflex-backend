import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ThumbnailService {
  private readonly BASE_PATH = path.join('static', 'thumbnails');
  private readonly EXTENSION = '.jpeg';

  getThumbnailPath(id: string, episode: number) {
    const fileName = this.getThumbnailFilename(id, episode);
    return `/public/thumbnails/${id}/${fileName}`;
  }

  async createThumbnail(
    id: string,
    episode: number,
    thumbnail: Express.Multer.File,
  ) {
    const existedThumbnail = this.getThumbnailFilename(id, episode);
    if (existedThumbnail) {
      throw new ConflictException(
        `Thumbnail existed (id: ${id}, episode: ${episode})`,
      );
    }
    const outputFile = `${episode}_${this.getHash()}${this.EXTENSION}`;
    const directory = path.join(this.BASE_PATH, id);
    await fs.promises.mkdir(directory, { recursive: true });
    await fs.promises.writeFile(
      path.join(directory, outputFile),
      thumbnail.buffer,
    );
  }

  async updateThumbnail(
    id: string,
    episode: number,
    thumbnail: Express.Multer.File,
  ) {
    const existedThumbnail = this.getThumbnailFilename(id, episode);
    if (!existedThumbnail) {
      throw new NotFoundException(
        `Thumbnail not existed (id: ${id}, episode: ${episode})`,
      );
    }
    const directory = path.join(this.BASE_PATH, id);
    const existedPath = path.join(directory, existedThumbnail);
    const outputPath = path.join(
      directory,
      `${episode}_${this.getHash()}${this.EXTENSION}`,
    );
    await fs.promises.rm(existedPath);
    await fs.promises.writeFile(outputPath, thumbnail.buffer);
  }

  async deleteThumbnail(id: string, episode: number) {
    const existedThumbnail = this.getThumbnailFilename(id, episode);
    if (!existedThumbnail) {
      throw new NotFoundException(
        `Thumbnail not existed (id: ${id}, episode: ${episode})`,
      );
    }
    const episodeRoot = path.join(this.BASE_PATH, id);
    await fs.promises.rm(path.join(episodeRoot, existedThumbnail));
    const dir = await fs.promises.readdir(episodeRoot);
    if (dir.length === 0) {
      await fs.promises.rm(episodeRoot, { recursive: true });
    }
  }

  private getHash() {
    return crypto.randomBytes(4).toString('hex');
  }

  private getThumbnailFilename(id: string, episode: number) {
    const root = path.join(this.BASE_PATH, id);
    if (!fs.existsSync(root)) {
      return null;
    }
    const dir = fs.readdirSync(root);
    return dir.find((file) =>
      path.parse(file).name.startsWith(`${episode.toString()}_`),
    );
  }
}
