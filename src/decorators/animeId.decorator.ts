import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { UUID_REGEX } from '../constants';

export const AnimeId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const id = req.get('anime-id') as string;
    if (!id || !UUID_REGEX.test(id)) {
      throw new BadRequestException(
        'Anime-ID (UUIDv4) must be provided in the header.',
      );
    }
    return id;
  },
);
