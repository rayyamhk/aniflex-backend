import * as path from 'node:path';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { VideosService } from './videos.service';
import { VideoInterceptor } from './interceptors/video.interceptor';
import { ValidateExistencePipe } from '../../pipes/validateExistence.pipe';
import { ValidateKeyPipe } from '../../pipes/validateKey.pipe';
import { Response } from 'express';
import { StorageService } from '../storage/storage.service';
import { Public } from '../../decorators/public.decorator';
import { ValidateChunkNamePipe } from './pipes/chunkName.validate';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly storageService: StorageService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get(':key/:filename')
  @Public()
  async getChunk(
    @Param('key', ValidateKeyPipe) key: string,
    @Param('filename', ValidateChunkNamePipe) filename: string,
    @Res() res: Response,
  ) {
    const s3Response = await this.storageService.get(`${key}/${filename}`);
    if (!s3Response)
      throw new NotFoundException(
        `Video chunk not found (key: ${key}, chunk: ${filename})`,
      );
    Object.entries(s3Response.headers).forEach(([k, v]: [string, string]) => {
      res.set(k, v);
    });
    res.set('Cache-Control', 'public, max-age=86400');
    s3Response.pipe(res);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(VideoInterceptor)
  async createChunks(
    @UploadedFile(ValidateExistencePipe) video: Express.Multer.File,
  ) {
    const key = path.parse(video.filename).name;
    this.videosService.create(key, video); // process in the background without blocking the request
    return this.utilsService.formatResponse(
      `Video uploaded (key: ${key}), it may take a while to process the video.`,
      { path: `/videos/${key}/out.m3u8` },
    );
  }

  @Delete()
  async deleteChunks(@Body('key', ValidateKeyPipe) key: string) {
    await this.videosService.delete(key);
    return this.utilsService.formatResponse(`Video deleted (key: ${key})`);
  }
}
