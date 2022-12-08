import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { ImagesController } from './images.controller';
import { IMAGES_STORAGE } from '../../constants';

@Module({
  imports: [StorageModule.register(IMAGES_STORAGE)],
  controllers: [ImagesController],
})
export class ImagesModule {}
