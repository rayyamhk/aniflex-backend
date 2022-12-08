import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { SeriesModule } from './modules/series/series.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { VideosModule } from './modules/videos/videos.module';
import { UtilsModule } from './modules/utils/utils.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 3600,
      limit: 360,
    }),
    ScheduleModule.forRoot(),
    UtilsModule,
    SeriesModule,
    EpisodesModule,
    VideosModule,
    ImagesModule,
  ],
})
export class AppModule {}
