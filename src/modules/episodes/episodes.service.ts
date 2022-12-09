import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { SeriesService } from '../series/series.service';
import { Episode } from './types/Episode';
import {
  CreateEpisodeDTO,
  QueryEpisodesDTO,
  UpdateEpisodeDTO,
} from './dto/episode.dto';

@Injectable()
export class EpisodesService {
  private viewsCache = new Map<string, number>();

  constructor(
    private readonly databaseService: DatabaseService<Episode>,
    private readonly seriesService: SeriesService,
  ) {}

  // Every 10 minutes
  @Cron('0 */10 * * * *')
  private async updateEpisodeViews() {
    for (const [id, count] of this.viewsCache) {
      const episode = await this.databaseService.findOneById(id);
      await this.databaseService.replaceOneById(id, {
        ...episode,
        views: episode.views + count,
      });
    }
    this.viewsCache.clear();
  }

  async getEpisodes(query: QueryEpisodesDTO) {
    const { serie: serieId, limit, orderBy, sortBy } = query;
    const options = {
      sort: { [orderBy]: sortBy === 'asc' ? 1 : -1 },
      limit,
    } as const;
    if (serieId) {
      const serie = await this.seriesService.get(serieId);
      if (!serie || serie.episodes.length === 0) return [];
      const episodes = this.databaseService.findByIds(serie.episodes, options, {
        key: `/episodes?serie=${serieId}&orderBy=${orderBy}&sortBy=${sortBy}&limit=${limit}`,
        ttl: 1000 * 60 * 5,
      });
      return episodes;
    }
    const episodes = await this.databaseService.find(options, {
      key: `/episodes?limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`,
      ttl: 1000 * 60 * 5,
    });
    return episodes;
  }

  async create(body: CreateEpisodeDTO) {
    const createdEpisode: Episode = {
      _id: randomUUID(),
      uploadedAt: new Date().toISOString(),
      views: 0,
      ...body,
    };
    await this.databaseService.insertOne(createdEpisode);
    return createdEpisode;
  }

  async update(newEpisode: UpdateEpisodeDTO) {
    const result = await this.databaseService.replaceOneById(
      newEpisode._id,
      newEpisode,
    );
    if (result.modifiedCount === 0) {
      if (result.matchedCount === 0) {
        throw new NotFoundException(
          `Episode not found (id: ${newEpisode._id})`,
        );
      } else {
        throw new BadRequestException(
          `Episode not changed (id: ${newEpisode._id})`,
        );
      }
    }
  }

  incrementViews(id: string) {
    const prevViews = this.viewsCache.get(id) || 0;
    this.viewsCache.set(id, prevViews + 1);
  }

  async delete(id: string) {
    const result = await this.databaseService.deleteOneById(id);
    if (result.deletedCount === 0)
      throw new NotFoundException(`Episode not found (id: ${id})`);
  }
}
