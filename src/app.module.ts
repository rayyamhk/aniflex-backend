import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SeriesModule } from './modules/series/series.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { VideosModule } from './modules/videos/videos.module';
import { UtilsModule } from './modules/utils/utils.module';
import { AppController } from './app.controller';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 3600,
      limit: 360,
    }),
    UtilsModule,
    SeriesModule,
    EpisodesModule,
    VideosModule,
    ImagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
