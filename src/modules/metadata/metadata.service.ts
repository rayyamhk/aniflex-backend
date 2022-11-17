import { Injectable, NotFoundException } from '@nestjs/common';
import { ThumbnailService } from '../thumbnail/thumbnail.service';
import { EpisodesService } from '../episodes/episodes.service';
import { SeriesService } from '../series/series.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly episodesService: EpisodesService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async getAllEpisodesMetadata() {
    const episodes = await this.episodesService.getAllEpisodes();
    return episodes.map((item) => this.episodesService.getPublicEpisode(item));
  }

  async getEpisodeMetadata(id: string, episode: number) {
    const serie = await this.seriesService.getSerie(id, {
      namespace: 'MetadataService:getEpisodeMetadata',
      ttl: 1000 * 60 * 5, // 5 min
    });
    if (!serie) {
      throw new NotFoundException(`Serie not found (id: ${id})`);
    }
    if (episode > serie.episodes) {
      throw new NotFoundException(`Episode not found (episode: ${episode})`);
    }
    const episodes = await this.episodesService.getEpisodes(id, {
      namespace: 'MetadataService:getEpisodeMetadata',
      ttl: 1000 * 60 * 5, // 5 min
    });
    const data = {
      id: serie.id,
      title: serie.title,
      description: serie.description,
      thumbnail: this.thumbnailService.getThumbnailPath(serie.id, 0),
      tags: serie.tags || [],
      episodes: episodes.map((item) =>
        this.episodesService.getPublicEpisode(item),
      ),
    };
    return data;
  }
}