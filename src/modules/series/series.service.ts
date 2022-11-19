import * as crypto from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CacheSettings,
  DatabaseService,
} from '../database/database.service';
import { Serie } from './types/Serie';
import { CreateSerieDTO, UpdateSerieDTO } from './dto/serie.dto';

@Injectable()
export class SeriesService {
  constructor(private readonly databaseService: DatabaseService<Serie>) {}

  async get(id: string, cacheSettings?: CacheSettings) {
    return await this.databaseService.getItemByPrimaryKey(
      { partitionKey: ['id', id] },
      cacheSettings,
    );
  }

  async getAll() {
    return await this.databaseService.getAllItems();
  }

  async create(body: CreateSerieDTO) {
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

  async update(newSerie: UpdateSerieDTO) {
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
    if (updateFieldsCount === 0 && Object.keys(originalSerie).length === Object.keys(newSerie).length) {
      throw new BadRequestException(
        'Serie update is unnecessary (nothing is changed)',
      );
    }
    await this.databaseService.putItem(newSerie);
    return newSerie;
  }

  async delete(id: string) {
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
