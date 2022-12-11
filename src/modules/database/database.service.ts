import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Collection, Document, FindOptions, MongoClient } from 'mongodb';
import { Cache } from 'cache-manager';
import { COLLECTION_NAME } from '../../constants';

export type CacheSettings = {
  key: string;
  ttl?: number;
};

export type FindOptionsType = FindOptions<Document>;

@Injectable()
export class DatabaseService<T> {
  private readonly collection: Collection<Document>;
  private readonly MONGO_USERNAME = process.env.MONGO_USERNAME;
  private readonly MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  private readonly MONGO_HOST = process.env.MONGO_HOST || 'localhost:27017';
  private readonly MONGO_DATABASE = process.env.MONGO_DATABASE || 'test';

  constructor(
    @Inject(COLLECTION_NAME) private readonly collectionName: string,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {
    const credential =
      this.MONGO_USERNAME && this.MONGO_PASSWORD
        ? `${this.MONGO_USERNAME}:${this.MONGO_PASSWORD}@`
        : '';
    const uri = `mongodb://${credential}${this.MONGO_HOST}?retryWrites=true&w=majority`;
    this.collection = new MongoClient(uri)
      .db(this.MONGO_DATABASE)
      .collection(this.collectionName);
  }

  async findOne(fields: Partial<T>, cacheSettings?: CacheSettings) {
    if (cacheSettings) {
      const cached = await this.cacheService.get<T>(cacheSettings.key);
      if (cached) return cached;
    }
    const item = await this.collection.findOne<T>(fields);
    if (!item) return null;
    if (cacheSettings)
      await this.cacheService.set(cacheSettings.key, item, cacheSettings.ttl);
    return item;
  }

  async findOneById(id: string, cacheSettings?: CacheSettings) {
    if (cacheSettings) {
      const cached = await this.cacheService.get<T>(cacheSettings.key);
      if (cached) return cached;
    }
    const item = await this.collection.findOne<T>({ _id: id });
    if (!item) return null;
    if (cacheSettings)
      await this.cacheService.set(cacheSettings.key, item, cacheSettings.ttl);
    return item;
  }

  async findByIds(ids: string[], options: FindOptionsType, cacheSettings?: CacheSettings) {
    if (cacheSettings) {
      const cached = await this.cacheService.get<T[]>(cacheSettings.key);
      if (cached) return cached;
    }
    const items = await this.collection
      .find<T>({ _id: { $in: ids } }, options)
      .toArray();
    if (!items || items.length === 0) return [];
    if (cacheSettings)
      await this.cacheService.set(cacheSettings.key, items, cacheSettings.ttl);
    return items;
  }

  async find(options: FindOptionsType, cacheSettings?: CacheSettings) {
    if (cacheSettings) {
      const cached = await this.cacheService.get<T[]>(cacheSettings.key);
      if (cached) return cached;
    }
    const items = await this.collection.find<T>({}, options).toArray();
    if (!items || items.length === 0) return [];
    if (cacheSettings)
      await this.cacheService.set(cacheSettings.key, items, cacheSettings.ttl);
    return items;
  }

  async insertOne(item: T) {
    return await this.collection.insertOne(item);
  }

  async updateOneById(id: string, fields: Partial<T>) {
    return await this.collection.updateOne(
      { _id: id },
      {
        $set: fields,
      },
    );
  }

  async replaceOneById(id: string, item: T) {
    return await this.collection.replaceOne({ _id: id }, item);
  }

  async deleteOneById(id: string) {
    return await this.collection.deleteOne({ _id: id });
  }
}
