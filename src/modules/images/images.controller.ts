import * as crypto from 'node:crypto';
import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ValidateKeyPipe } from '../../pipes/validateKey.pipe';
import { ImageIntersecptor } from './interceptors/image.interceptor';
import { ValidateExistencePipe } from 'src/pipes/validateExistence.pipe';
import { UtilsService } from '../utils/utils.service';
import { StorageService } from '../storage/storage.service';
import { Public } from '../../decorators/public.decorator';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly storageService: StorageService,
    private readonly utilsService: UtilsService,
  ) {}

  @Public()
  @Get(':key')
  async getImage(
    @Param('key', ValidateKeyPipe) key: string,
    @Res() res: Response,
  ) {
    const s3Response = await this.storageService.get(key);
    if (!s3Response) {
      throw new NotFoundException(`Image not found (key: ${key})`);
    }
    Object.entries(s3Response.headers).forEach(([k, v]: [string, string]) => {
      res.set(k, v);
    });
    res.set('Cache-Control', 'public, max-age=31536000');
    s3Response.pipe(res);
  }

  @Post()
  @UseInterceptors(ImageIntersecptor)
  async createImage(
    @UploadedFile(ValidateExistencePipe) image: Express.Multer.File,
  ) {
    const key = this.getHash();
    await this.storageService.put(key, image.buffer, image.mimetype);
    return this.utilsService.formatResponse(`Image uploaded (key: ${key})`, {
      path: `/images/${key}`,
    });
  }

  @Delete()
  async deleteImage(@Body('key', ValidateKeyPipe) key: string) {
    await this.storageService.delete(key);
    return this.utilsService.formatResponse(`Image deleted (key: ${key})`);
  }

  private getHash() {
    return crypto.randomBytes(8).toString('hex');
  }
}
