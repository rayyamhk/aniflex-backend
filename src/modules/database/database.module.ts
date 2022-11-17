import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static register(tableName: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [CacheModule.register()],
      providers: [
        DatabaseService,
        {
          provide: 'TABLE_NAME',
          useValue: tableName,
        },
      ],
      exports: [DatabaseService],
    };
  }
}
