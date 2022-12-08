import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SeriesModule } from '../series/series.module';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { ANIME_EPISODES_DATABASE } from '../../constants';

@Module({
  imports: [DatabaseModule.register(ANIME_EPISODES_DATABASE), SeriesModule],
  controllers: [EpisodesController],
  providers: [EpisodesService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
