import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UtilsService } from '../utils/utils.service';
import { MetadataService } from './metadata.service';
import { ParsePositiveIntPipe } from '../../pipes/parsePositiveInt.pipe';

@Controller('metadata')
@UseGuards(ThrottlerGuard)
export class MetadataController {
  constructor(
    private readonly metadataService: MetadataService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('episodes')
  async getEpisodes() {
    const data = await this.metadataService.getAllEpisodesMetadata();
    return this.utilsService.formatResponse(null, data);
  }

  @Get('episodes/:id')
  async getEpisodeMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('episode', ParsePositiveIntPipe) episode: number,
  ) {
    const data = await this.metadataService.getEpisodeMetadata(id, episode);
    return this.utilsService.formatResponse(null, data);
  }
}
