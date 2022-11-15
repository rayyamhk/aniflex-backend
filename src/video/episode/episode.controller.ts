import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import {
  CreateEpisodeDTO,
  DeleteEpisodeDTO,
  UpdateEpisodeDTO,
} from './dto/episode.dto';
import { UtilsService } from '../../utils/utils.service';
import { EpisodeService } from './episode.service';

@Controller('videos/episodes')
export class EpisodeController {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  async createEpisode(@Body() body: CreateEpisodeDTO) {
    const episode = await this.episodeService.createEpisode(body);
    return this.utilsService.formatResponse(
      `Episode created (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Put()
  async updateEpisode(@Body() episode: UpdateEpisodeDTO) {
    await this.episodeService.updateEpisode(episode);
    return this.utilsService.formatResponse(
      `Episode updated (id: ${episode.id}, episode: ${episode.episode})`,
      episode,
    );
  }

  @Delete()
  async deleteEpisode(@Body() primaryKey: DeleteEpisodeDTO) {
    const { id, episode } = primaryKey;
    const deletedEpisode = await this.episodeService.deleteEpisode(id, episode);
    return this.utilsService.formatResponse(
      `Episode deleted (id: ${id}, episode: ${episode})`,
      deletedEpisode,
    );
  }
}
