import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const AnimeEpisode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const episode = req.get('anime-episode') as string;
    if (!episode || !Number.isInteger(Number(episode)) || Number(episode) < 0) {
      // zero is allowed here because the episode 0 is treated as anime serie.
      throw new BadRequestException(
        'Anime-Episode (non-negative integer) must be provided in header.',
      );
    }
    return Number(episode);
  },
);
