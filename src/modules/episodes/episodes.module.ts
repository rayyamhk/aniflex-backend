import { Module } from '@nestjs/common';
import { ThumbnailModule } from '../thumbnail/thumbnail.module';
import { ANIME_EPISODES_DATABASE } from '../../constants';
import { DatabaseModule } from '../database/database.module';
import { VideosModule } from '../videos/videos.module';
import { SeriesModule } from '../series/series.module';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

@Module({
  imports: [
    DatabaseModule.register(ANIME_EPISODES_DATABASE),
    SeriesModule,
    VideosModule,
    ThumbnailModule,
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
