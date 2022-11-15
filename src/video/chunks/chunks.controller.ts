import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UtilsService } from '../../utils/utils.service';
import { ChunksService } from './chunks.service';
import { VideoInterceptor } from './interceptors/video.interceptor';
import { AnimeId } from '../../decorators/animeId.decorator';
import { AnimeEpisode } from '../../decorators/animeEpisode.decorator';
import { ValidateExistencePipe } from '../../pipes/validateExistence.pipe';

@Controller('videos/chunks')
export class ChunksController {
  constructor(
    private readonly chunksService: ChunksService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(VideoInterceptor)
  async createChunks(
    @UploadedFile(ValidateExistencePipe) video: Express.Multer.File,
    @AnimeId() id: string,
    @AnimeEpisode() episode: number,
  ) {
    await this.chunksService.prepareEnvironment(id, episode, video);
    this.chunksService.processVideo(id, episode, video); // process in the background without blocking the request
    return this.utilsService.formatResponse(
      `Video uploaded (id: ${id}, episode: ${episode}), it may take a while to process the video.`,
    );
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(VideoInterceptor)
  async updateChunks(
    @UploadedFile(ValidateExistencePipe) video: Express.Multer.File,
    @AnimeId() id: string,
    @AnimeEpisode() episode: number,
  ) {
    await this.chunksService.prepareEnvironment(id, episode, video);
    this.chunksService.processVideo(id, episode, video); // process in the background without blocking the request
    return this.utilsService.formatResponse(
      `Video updated (id: ${id}, episode: ${episode}), it may take a while to process the video.`,
    );
  }

  @Delete()
  async deleteChunks(@AnimeId() id: string, @AnimeEpisode() episode: number) {
    await this.chunksService.deleteChunks(id, episode);
    return this.utilsService.formatResponse(
      `Video deleted (id: ${id}, episode: ${episode})`,
    );
  }
}
