import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

const UUID_REGEX =
  /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;

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
