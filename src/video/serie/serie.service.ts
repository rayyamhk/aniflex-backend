import * as crypto from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CacheSettings,
  DatabaseService,
} from '../../database/database.service';
import { Serie } from './types/Serie';
import { CreateSerieDTO, UpdateSerieDTO } from './dto/serie.dto';
import { ThumbnailService } from '../../thumbnail/thumbnail.service';

@Injectable()
export class SerieService {
  constructor(
    private readonly databaseService: DatabaseService<Serie>,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async getSerie(id: string, cacheSettings?: CacheSettings) {
    return await this.databaseService.getItemByPrimaryKey(
      { partitionKey: ['id', id] },
      cacheSettings,
    );
  }

  async getAllSeries(limit?: number, cacheSettings?: CacheSettings) {
    return await this.databaseService.getAllItems(limit, cacheSettings);
  }

  getPublicSerie(serie: Serie) {
    return {
      ...serie,
      thumbnail: this.thumbnailService.getThumbnailPath(serie.id, 0),
    };
  }

  async createSerie(body: CreateSerieDTO) {
    const createdSerie: Serie = {
      id: crypto.randomUUID(),
      episodes: 0,
      uploadedAt: new Date().toISOString(),
      views: 0,
      ...body,
    };
    await this.databaseService.putItem(createdSerie);
    return createdSerie;
  }

  async updateSerie(newSerie: UpdateSerieDTO) {
    const id = newSerie.id;
    const originalSerie = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
    });
    if (!originalSerie) {
      throw new NotFoundException(`Serie not found (id: ${id})`);
    }
    let updateFieldsCount = 0;
    Object.keys(newSerie).forEach((key) => {
      if (newSerie[key] !== originalSerie[key]) {
        updateFieldsCount += 1;
      }
    });
    if (updateFieldsCount === 0) {
      throw new ConflictException(
        'Serie update is unnecessary (nothing is changed)',
      );
    }
    await this.databaseService.putItem(newSerie);
    return newSerie;
  }

  async deleteSerie(id: string) {
    const existedSerie = await this.databaseService.getItemByPrimaryKey({
      partitionKey: ['id', id],
    });
    if (!existedSerie) {
      throw new NotFoundException(`Serie not found (id: ${id})`);
    }
    await this.databaseService.deleteItemByPrimaryKey({
      partitionKey: ['id', id],
    });
    return existedSerie;
  }
}
