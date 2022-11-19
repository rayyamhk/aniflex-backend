import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.get('x-api-key');
    if (!process.env.API_KEY || process.env.API_KEY !== apiKey) {
      throw new ForbiddenException('Unauthorized request.');
    }
    return true;
  }
}
