import { Module } from '@nestjs/common';
import { ThumbnailModule } from '../../thumbnail/thumbnail.module';
import { ANIME_EPISODES_DATABASE } from '../../constants';
import { DatabaseModule } from '../../database/database.module';
import { ChunksModule } from '../chunks/chunks.module';
import { SerieModule } from '../serie/serie.module';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';

@Module({
  imports: [
    DatabaseModule.register(ANIME_EPISODES_DATABASE),
    SerieModule,
    ChunksModule,
    ThumbnailModule,
  ],
  controllers: [EpisodeController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
