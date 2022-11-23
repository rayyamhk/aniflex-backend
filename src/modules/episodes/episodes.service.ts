import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CacheSettings, DatabaseService } from '../database/database.service';
import { SeriesService } from '../series/series.service';
import { Episode } from './types/Episode';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from './dto/episode.dto';

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
    for (let [k, v] of this.viewsCache) {
      const [id, episode] = k.split('|');
      const item = await this.databaseService.getItemByPrimaryKey({
        partitionKey: ['id', id],
        sortKey: ['episode', Number(episode)],
      });
      await this.databaseService.putItem({
        ...item,
        views: item.views + v,
      });
    }
    this.viewsCache.clear();
  }

  async getEpisodes(id: string, cacheSettings?: CacheSettings) {
    return await this.databaseService.getItemsByPartitionKey(
      { partitionKey: ['id', id] },
      cacheSettings,
    );
  }

  async getAllEpisodes() {
    return await this.databaseService.getAllItems();
  }

  async create(body: CreateEpisodeDTO) {
    const { id, episode } = body;
    const existedSerie = await this.seriesService.get(id);
    if (!existedSerie) {
      throw new NotFoundException(`Serie not found (id: ${id})`);
    }
    const existedEpisode = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
      sortKey: ['episode', episode],
    });
    if (existedEpisode) {
      throw new ConflictException(
        `Episode existed (id: ${id}, episode: ${episode})`,
      );
    }
    const createdEpisode: Episode = {
      uploadedAt: new Date().toISOString(),
      views: 0,
      ...body,
    };
    await this.databaseService.putItem(createdEpisode);
    await this.seriesService.update({
      ...existedSerie,
      episodes: existedSerie.episodes + 1,
    });
    return createdEpisode;
  }

  async update(newEpisode: UpdateEpisodeDTO) {
    const { id, episode } = newEpisode;
    const originalEpisode = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
      sortKey: ['episode', episode],
    });
    if (!originalEpisode) {
      throw new NotFoundException(
        `Episode not found (id: ${id}, episode: ${episode})`,
      );
    }
    let updateFieldsCount = 0;
    Object.keys(newEpisode).forEach((key) => {
      if (newEpisode[key] !== originalEpisode[key]) {
        updateFieldsCount += 1;
      }
    });
    if (
      updateFieldsCount === 0 &&
      Object.keys(originalEpisode).length === Object.keys(newEpisode).length
    ) {
      throw new BadRequestException(
        'Episode update is unnecessary (nothing is changed)',
      );
    }
    await this.databaseService.putItem(newEpisode);
    return newEpisode;
  }

  incrementViews(id: string, episode: number) {
    const key = `${id}|${episode}`;
    const prevViews = this.viewsCache.get(key) || 0;
    this.viewsCache.set(key, prevViews + 1);
  }

  async delete(id: string, episode: number) {
    const existedEpisode = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
      sortKey: ['episode', episode],
    });
    if (!existedEpisode) {
      throw new NotFoundException(
        `Episode not found (id: ${id}, episode: ${episode})`,
      );
    }
    const existedSerie = await this.seriesService.get(id);

    // episode exists imples serie exists,
    // therefore it must not be null.
    // Defensive check.
    if (!existedSerie) {
      throw new InternalServerErrorException(`Internal server error`);
    }
    await this.databaseService.deleteItemByPrimaryKey({
      partitionKey: ['id', id],
      sortKey: ['episode', episode],
    });
    await this.seriesService.update({
      ...existedSerie,
      episodes: existedSerie.episodes - 1,
    });
    return existedEpisode;
  }
}
