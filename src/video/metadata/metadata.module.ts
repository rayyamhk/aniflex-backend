import { Module } from '@nestjs/common';
import { ThumbnailModule } from 'src/thumbnail/thumbnail.module';
import { EpisodeModule } from '../episode/episode.module';
import { SerieModule } from '../serie/serie.module';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  imports: [SerieModule, EpisodeModule, ThumbnailModule],
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
