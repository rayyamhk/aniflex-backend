import { Injectable, NotFoundException } from '@nestjs/common';
import { ThumbnailService } from '../../thumbnail/thumbnail.service';
import { EpisodeService } from '../episode/episode.service';
import { SerieService } from '../serie/serie.service';

@Injectable()
export class MetadataService {
  constructor(
    private readonly serieService: SerieService,
    private readonly episodeService: EpisodeService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async getAllEpisodesMetadata() {
    const episodes = await this.episodeService.getAllEpisodes();
    return episodes.map((item) => this.episodeService.getPublicEpisode(item));
  }

  async getEpisodeMetadata(id: string, episode: number) {
    const serie = await this.serieService.getSerie(id, {
      namespace: 'MetadataService:getEpisodeMetadata',
      ttl: 1000 * 60 * 10, // 10 min
    });
    if (!serie) {
      throw new NotFoundException(`Serie not found (id: ${id})`);
    }
    if (episode > serie.episodes) {
      throw new NotFoundException(`Episode not found (episode: ${episode})`);
    }
    const episodes = await this.episodeService.getEpisodes(id, {
      namespace: 'MetadataService:getEpisodeMetadata',
      ttl: 1000 * 60 * 5, // 5 min
    });
    const data = {
      id: serie.id,
      title: serie.title,
      description: serie.description,
      thumbnail: await this.thumbnailService.getThumbnailPath(serie.id, 0),
      tags: serie.tags || [],
      episodes: episodes.map((item) =>
        this.episodeService.getPublicEpisode(item),
      ),
    };
    return data;
  }
}
