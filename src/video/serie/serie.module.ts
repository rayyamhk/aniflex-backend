import { Module } from '@nestjs/common';
import { ThumbnailModule } from 'src/thumbnail/thumbnail.module';
import { ANIME_SERIES_DATABASE } from '../../constants';
import { DatabaseModule } from '../../database/database.module';
import { SerieController } from './serie.controller';
import { SerieService } from './serie.service';

@Module({
  imports: [DatabaseModule.register(ANIME_SERIES_DATABASE), ThumbnailModule],
  controllers: [SerieController],
  providers: [SerieService],
  exports: [SerieService],
})
export class SerieModule {}
