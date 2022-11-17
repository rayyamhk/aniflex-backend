import {
  Controller,
  Delete,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import { UtilsService } from '../utils/utils.service';
import { ThumbnailInterceptor } from './interceptors/thumbnail.interceptor';
import { AnimeEpisode } from '../../decorators/animeEpisode.decorator';
import { AnimeId } from '../../decorators/animeId.decorator';
import { ValidateExistencePipe } from '../../pipes/validateExistence.pipe';

@Controller('thumbnails')
export class ThumbnailController {
  constructor(
    private readonly thumbnailService: ThumbnailService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  @UseInterceptors(ThumbnailInterceptor)
  async createThumbnail(
    @UploadedFile(ValidateExistencePipe) thumbnail: Express.Multer.File,
    @AnimeId() id: string,
    @AnimeEpisode() episode: number,
  ) {
    console.log(thumbnail);
    await this.thumbnailService.createThumbnail(id, episode, thumbnail);
    return this.utilsService.formatResponse(
      `Thumbnail created (id: ${id}, episode: ${episode})`,
    );
  }

  @Put()
  @UseInterceptors(ThumbnailInterceptor)
  async updateThumbnail(
    @UploadedFile(ValidateExistencePipe) thumbnail: Express.Multer.File,
    @AnimeId() id: string,
    @AnimeEpisode() episode: number,
  ) {
    await this.thumbnailService.updateThumbnail(id, episode, thumbnail);
    return this.utilsService.formatResponse(
      `Thumbnail updated (id: ${id}, episode: ${episode})`,
    );
  }

  @Delete()
  async deleteThumbnail(
    @AnimeId() id: string,
    @AnimeEpisode() episode: number,
  ) {
    await this.thumbnailService.deleteThumbnail(id, episode);
    return this.utilsService.formatResponse(
      `Thumbnail deleted (id: ${id}, episode: ${episode})`,
    );
  }
}
