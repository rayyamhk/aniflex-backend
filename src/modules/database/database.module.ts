import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { COLLECTION_NAME } from '../../constants';

@Module({})
export class DatabaseModule {
  static register(collectionName: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [CacheModule.register()],
      providers: [
        DatabaseService,
        {
          provide: COLLECTION_NAME,
          useValue: collectionName,
        },
      ],
      exports: [DatabaseService],
    };
  }
}
