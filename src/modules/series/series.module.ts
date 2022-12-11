import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { SERIES_COLLECTION } from '../../constants';

@Module({
  imports: [DatabaseModule.register(SERIES_COLLECTION)],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
