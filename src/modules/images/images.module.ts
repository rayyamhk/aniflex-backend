import { Module } from '@nestjs/common';
import { IMAGES_STORAGE } from 'src/constants';
import { StorageModule } from '../storage/storage.module';
import { ImagesController } from './images.controller';

@Module({
  imports: [StorageModule.register(IMAGES_STORAGE)],
  controllers: [ImagesController],
})
export class ImagesModule {}
