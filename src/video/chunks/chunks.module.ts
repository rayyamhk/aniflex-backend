import { Module } from '@nestjs/common';
import { ChunksController } from './chunks.controller';
import { ChunksService } from './chunks.service';

@Module({
  controllers: [ChunksController],
  providers: [ChunksService],
  exports: [ChunksService],
})
export class ChunksModule {}
