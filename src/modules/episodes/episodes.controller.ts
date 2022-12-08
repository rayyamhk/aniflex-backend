import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateEpisodeDTO,
  QueryEpisodesDTO,
  UpdateEpisodeDTO,
} from './dto/episode.dto';
import { UtilsService } from '../utils/utils.service';
import { EpisodesService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
  constructor(
    private readonly episodesService: EpisodesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async getEpisodes(@Query() query: QueryEpisodesDTO) {
    const episodes = await this.episodesService.getEpisodes(query);
    return this.utilsService.formatResponse(null, episodes);
  }

  @Post()
  async createEpisode(@Body() body: CreateEpisodeDTO) {
    const episode = await this.episodesService.create(body);
    return this.utilsService.formatResponse('Episode created.', episode);
  }

  @Put()
  async updateEpisode(@Body() episode: UpdateEpisodeDTO) {
    await this.episodesService.update(episode);
    return this.utilsService.formatResponse('Episode updated.', episode);
  }

  @Patch()
  incrementViews(@Body('_id', ParseUUIDPipe) id: string) {
    this.episodesService.incrementViews(id);
    return this.utilsService.formatResponse(`Episode views incremented.`);
  }

  @Delete()
  async deleteEpisode(@Body('_id', ParseUUIDPipe) id: string) {
    await this.episodesService.delete(id);
    return this.utilsService.formatResponse(`Episode deleted.`);
  }
}
