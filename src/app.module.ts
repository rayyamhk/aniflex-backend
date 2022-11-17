import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThumbnailModule } from './modules/thumbnail/thumbnail.module';
import { SeriesModule } from './modules/series/series.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { VideosModule } from './modules/videos/videos.module';
import { UtilsModule } from './modules/utils/utils.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 3600,
      limit: 360,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static', 'thumbnails'),
      serveRoot: '/public/thumbnails',
      serveStaticOptions: {
        setHeaders: (res) => {
          res.set(
            'Cache-Control',
            'public, max-age=2629800, s-maxage=2629800, must-revalidate',
          );
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static', 'videos'),
      serveRoot: '/public/videos',
      serveStaticOptions: {
        setHeaders: (res) => {
          res.set(
            'Cache-Control',
            'public, max-age=3600, s-maxage=86400, must-revalidate',
          );
        },
      },
    }),
    UtilsModule,
    ThumbnailModule,
    SeriesModule,
    EpisodesModule,
    VideosModule,
    MetadataModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
