import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheSettings, DatabaseService } from '../database/database.service';
import { Serie } from './types/Serie';
import {
  CreateSerieDTO,
  QuerySeriesDTO,
  UpdateSerieDTO,
} from './dto/serie.dto';

@Injectable()
export class SeriesService {
  constructor(private readonly databaseService: DatabaseService<Serie>) {}

  async getSeries(query: QuerySeriesDTO) {
    const { limit, orderBy, sortBy } = query;
    const series = await this.databaseService.find(
      {
        sort: { [orderBy]: sortBy === 'asc' ? 1 : -1 },
        limit,
      },
      {
        key: `/series?limit=${limit}&orderBy=${orderBy}&sortBy=${sortBy}`,
        ttl: 1000 * 60 * 5,
      },
    );
    return series;
  }

  async getSerie(id: string) {
    const serie = await this.databaseService.findOneById(id, {
      key: `/series/${id}`,
      ttl: 1000 * 60 * 5,
    });
    return serie;
  }

  async get(id: string, cacheSettings?: CacheSettings) {
    return await this.databaseService.findOneById(id, cacheSettings);
  }

  async create(body: CreateSerieDTO) {
    const createdSerie: Serie = {
      ...body,
      _id: randomUUID(),
      episodes: [],
      uploadedAt: new Date().toISOString(),
      views: 0,
      tags: body.tags || [],
    };
    await this.databaseService.insertOne(createdSerie);
    return createdSerie;
  }

  async update(newSerie: UpdateSerieDTO) {
    const result = await this.databaseService.replaceOneById(
      newSerie._id,
      newSerie,
    );
    if (result.modifiedCount === 0) {
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Serie not found (id: ${newSerie._id})`);
      } else {
        throw new BadRequestException(
          `Serie not changed (id: ${newSerie._id})`,
        );
      }
    }
  }

  async delete(id: string) {
    const result = await this.databaseService.deleteOneById(id);
    if (result.deletedCount === 0)
      throw new NotFoundException(`Serie not found (id: ${id})`);
  }
}
