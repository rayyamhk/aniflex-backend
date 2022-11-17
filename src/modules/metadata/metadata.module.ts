import { Module } from '@nestjs/common';
import { ThumbnailModule } from 'src/modules/thumbnail/thumbnail.module';
import { EpisodesModule } from '../episodes/episodes.module';
import { SeriesModule } from '../series/series.module';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [SeriesModule, EpisodesModule, ThumbnailModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
