import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import {
  CreateEpisodeDTO,
  DeleteEpisodeDTO,
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

  @Post()
  async createEpisode(@Body() body: CreateEpisodeDTO) {
    const episode = await this.episodesService.createEpisode(body);
    return this.utilsService.formatResponse(
      `Episode created (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Put()
  async updateEpisode(@Body() episode: UpdateEpisodeDTO) {
    await this.episodesService.updateEpisode(episode);
    return this.utilsService.formatResponse(
      `Episode updated (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Delete()
  async deleteEpisode(@Body() primaryKey: DeleteEpisodeDTO) {
    const { id, episode } = primaryKey;
    const deletedEpisode = await this.episodesService.deleteEpisode(id, episode);
    return this.utilsService.formatResponse(
      `Episode deleted (id: ${id}, episode: ${episode})`,
      deletedEpisode,
    );
  }
}
