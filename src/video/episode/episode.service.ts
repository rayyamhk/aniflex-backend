import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CacheSettings,
  DatabaseService,
} from '../../database/database.service';
import { SerieService } from '../serie/serie.service';
import { Episode } from './types/Episode';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from './dto/episode.dto';
import { ChunksService } from '../chunks/chunks.service';
import { ThumbnailService } from 'src/thumbnail/thumbnail.service';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly databaseService: DatabaseService<Episode>,
    private readonly serieService: SerieService,
    private readonly chunksService: ChunksService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  /**
   * Get all episodes by serie id
   */
  async getEpisodes(id: string, cacheSettings?: CacheSettings) {
    return await this.databaseService.getItemsByPartitionKey(
      { partitionKey: ['id', id] },
      cacheSettings,
    );
  }

  async getAllEpisodes() {
    return await this.databaseService.getAllItems();
  }

  getPublicEpisode(episode: Episode) {
    return {
      ...episode,
      thumbnail: this.thumbnailService.getThumbnailPath(
        episode.id,
        episode.episode,
      ),
      video: this.chunksService.getVideoPath(episode.id, episode.episode),
    };
  }

  async createEpisode(body: CreateEpisodeDTO) {
    const { id, episode } = body;
    const existedSerie = await this.serieService.getSerie(id);
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
    await this.serieService.updateSerie({
      ...existedSerie,
      episodes: existedSerie.episodes + 1,
    });
    return createdEpisode;
  }

  async updateEpisode(newEpisode: UpdateEpisodeDTO) {
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
    if (updateFieldsCount === 0) {
      throw new ConflictException(
        'Episode update is unnecessary (nothing is changed)',
      );
    }
    await this.databaseService.putItem(newEpisode);
    return newEpisode;
  }

  async deleteEpisode(id: string, episode: number) {
    const existedEpisode = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
      sortKey: ['episode', episode],
    });
    if (!existedEpisode) {
      throw new NotFoundException(
        `Episode not found (id: ${id}, episode: ${episode})`,
      );
    }
    const existedSerie = await this.serieService.getSerie(id);

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
    await this.serieService.updateSerie({
      ...existedSerie,
      episodes: existedSerie.episodes - 1,
    });
    return existedEpisode;
  }
}
