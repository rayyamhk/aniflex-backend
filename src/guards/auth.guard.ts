import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC } from '../constants';
import { JWTService } from '../modules/jwt/jwt.service';
import { User } from '../modules/user/types/User';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(JWTService) private readonly jwtService: JWTService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isControllerPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getClass(),
    );
    const isHandlerPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );
    if (isControllerPublic || isHandlerPublic) return true;
    const req = context.switchToHttp().getRequest<Request>();
    // 1. check api key
    const apiKey = req.get('x-api-key');
    if (process.env.API_KEY && apiKey === process.env.API_KEY) return true;

    // 2. check access and refresh tokens
    const accessToken = req.get('authorization');
    if (!accessToken) throw new ForbiddenException('Unauthorized.');
    const accessTokenParts = accessToken.split(' ');
    if (accessTokenParts.length !== 2 || accessTokenParts[0] !== 'Bearer') throw new ForbiddenException('Unauthorized.');
    const payload = this.jwtService.verifyAccessToken<Partial<User>>(accessTokenParts[1]);
    if (payload === 'invalid' || payload === 'expired' || payload.role !== 'admin') throw new ForbiddenException('Unauthorized.');
    return true;
  }
}
