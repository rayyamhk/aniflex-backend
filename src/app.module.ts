import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThumbnailModule } from './thumbnail/thumbnail.module';
import { SerieModule } from './video/serie/serie.module';
import { EpisodeModule } from './video/episode/episode.module';
import { ChunksModule } from './video/chunks/chunks.module';
import { UtilsModule } from './utils/utils.module';
import { MetadataModule } from './video/metadata/metadata.module';

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
    SerieModule,
    EpisodeModule,
    ChunksModule,
    MetadataModule,
  ],
})
export class AppModule {}
