import { Module } from '@nestjs/common';
import { ANIME_SERIES_DATABASE } from '../../constants';
import { DatabaseModule } from '../database/database.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [DatabaseModule.register(ANIME_SERIES_DATABASE)],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
