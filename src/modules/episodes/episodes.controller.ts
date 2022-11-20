import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateEpisodeDTO,
  DeleteEpisodeDTO,
  UpdateEpisodeDTO,
} from './dto/episode.dto';
import { UtilsService } from '../utils/utils.service';
import { EpisodesService } from './episodes.service';
import { Public } from '../../decorators/public.decorator';

@Controller('episodes')
export class EpisodesController {
  constructor(
    private readonly episodesService: EpisodesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Public()
  @Get(':id')
  async getEpisodes(@Param('id', ParseUUIDPipe) id: string) {
    const episodes = await this.episodesService.getEpisodes(id, {
      ttl: 1000 * 60 * 5,
      namespace: 'EpisodesController:getEpisodes',
    });
    return this.utilsService.formatResponse(null, episodes);
  }

  @Get()
  async getAllEpisodes() {
    const episodes = await this.episodesService.getAllEpisodes();
    return this.utilsService.formatResponse(null, episodes);
  }

  @Post()
  async createEpisode(@Body() body: CreateEpisodeDTO) {
    const episode = await this.episodesService.create(body);
    return this.utilsService.formatResponse(
      `Episode created (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Put()
  async updateEpisode(@Body() episode: UpdateEpisodeDTO) {
    await this.episodesService.update(episode);
    return this.utilsService.formatResponse(
      `Episode updated (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Delete()
  async deleteEpisode(@Body() primaryKey: DeleteEpisodeDTO) {
    const { id, episode } = primaryKey;
    const deletedEpisode = await this.episodesService.delete(id, episode);
    return this.utilsService.formatResponse(
      `Episode deleted (id: ${id}, episode: ${episode})`,
      deletedEpisode,
    );
  }
}
