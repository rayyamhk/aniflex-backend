import { Module } from '@nestjs/common';
import { ThumbnailModule } from 'src/modules/thumbnail/thumbnail.module';
import { ANIME_SERIES_DATABASE } from '../../constants';
import { DatabaseModule } from '../database/database.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [DatabaseModule.register(ANIME_SERIES_DATABASE), ThumbnailModule],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
