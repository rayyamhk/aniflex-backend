import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Cache } from 'cache-manager';

type PrimaryKey = {
  partitionKey: [string, any];
  sortKey?: [string, any];
};

export type CacheSettings = {
  namespace: string;
  ttl?: number;
};

@Injectable()
export class DatabaseService<T> {
  private readonly ddbClient: DynamoDBClient;
  private readonly REGION = process.env.REGION || 'us-east-2';

  constructor(
    @Inject('TABLE_NAME') private readonly tableName: string,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {
    this.ddbClient = new DynamoDBClient({ region: this.REGION });
  }

  async getItemByPrimaryKey(
    primaryKey: PrimaryKey,
    cacheSettings?: CacheSettings,
  ) {
    let cacheKey: string;

    if (cacheSettings) {
      cacheKey = this.getCacheKey(cacheSettings.namespace, primaryKey);
      const cached = await this.cacheService.get<T>(cacheKey);
      if (cached) return cached;
    }

    const res = await this.ddbClient.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall(this.formatPrimaryKey(primaryKey)),
      }),
    );
    if (!res.Item) return null;
    const data = unmarshall(res.Item) as T;
    if (cacheSettings) {
      await this.cacheService.set(cacheKey, data, cacheSettings.ttl);
    }
    return data;
  }

  async getItemsByPartitionKey(
    primaryKey: PrimaryKey,
    cacheSettings?: CacheSettings,
  ) {
    let cacheKey: string;

    if (cacheSettings) {
      cacheKey = this.getCacheKey(cacheSettings.namespace, primaryKey);
      const cached = await this.cacheService.get<T[]>(cacheKey);
      if (cached) return cached;
    }

    const res = await this.ddbClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: `#k = :v`,
        ExpressionAttributeValues: marshall({
          ':v': primaryKey.partitionKey[1],
        }),
        ExpressionAttributeNames: { '#k': primaryKey.partitionKey[0] },
      }),
    );
    const data = res.Items.map((item) => unmarshall(item)) as T[];
    if (cacheSettings && data.length > 0) {
      this.cacheService.set(cacheKey, data, cacheSettings.ttl);
    }
    return data;
  }

  async getAllItems(limit?: number, cacheSettings?: CacheSettings) {
    let cacheKey: string;

    if (cacheSettings) {
      cacheKey = this.getCacheKey(cacheSettings.namespace);
      const cached = await this.cacheService.get<T[]>(cacheKey);
      if (cached) return cached;
    }

    // dynamoDB scan operation at most return 1 MB data.
    const data: T[] = [];
    let res: ScanCommandOutput;
    do {
      res = await this.ddbClient.send(
        new ScanCommand({
          TableName: this.tableName,
          Limit: limit,
          ExclusiveStartKey: res?.LastEvaluatedKey,
        }),
      );
      res.Items.forEach((item) => data.push(unmarshall(item) as T));
    } while (res.LastEvaluatedKey);

    if (cacheSettings && data.length > 0) {
      this.cacheService.set(cacheKey, data, cacheSettings.ttl);
    }
    return data;
  }

  async putItem(item: T) {
    await this.ddbClient.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
      }),
    );
  }

  async deleteItemByPrimaryKey(primaryKey: PrimaryKey) {
    await this.ddbClient.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall(this.formatPrimaryKey(primaryKey)),
      }),
    );
  }

  private formatPrimaryKey(primaryKey: PrimaryKey): Record<string, any> {
    return Object.values(primaryKey).reduce(
      (prev, curr) => ({
        ...prev,
        [curr[0]]: curr[1],
      }),
      {},
    );
  }

  private getCacheKey(namespace: string, primaryKey?: PrimaryKey) {
    let partitionKeyValue = '',
      sortKeyValue = '';
    if (primaryKey) {
      partitionKeyValue = primaryKey.partitionKey[1];
      sortKeyValue = primaryKey?.sortKey?.[1] || '';
    }
    return `${this.tableName}#${namespace}#pk=${partitionKeyValue}#sk=${sortKeyValue}`;
  }
}
