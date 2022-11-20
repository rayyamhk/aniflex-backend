import { Module } from '@nestjs/common';
import { VIDEOS_STORAGE } from '../../constants';
import { StorageModule } from '../storage/storage.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [StorageModule.register(VIDEOS_STORAGE)],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
