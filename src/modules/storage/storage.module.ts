import { DynamicModule, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { BUCKET_NAME } from '../../constants';

@Module({})
export class StorageModule {
  static register(bucketName: string): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        StorageService,
        {
          provide: BUCKET_NAME,
          useValue: bucketName,
        },
      ],
      exports: [StorageService],
    };
  }
}
