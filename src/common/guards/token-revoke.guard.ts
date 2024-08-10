import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  extractAccessTokenFromHeader,
  extractRefreshTokenFromHeader,
} from 'src/utils/extract-token-from-request';
import { isPublicRoute } from 'src/utils/is-public-route';
import { SessionService } from 'src/v1/auth/session.service';
import { TokenRevokeException } from '../exceptions/token-revoke.exception';
import { IAuthToken } from '../interfaces/jwt.interface';

@Injectable()
export class TokenRevokeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (isPublicRoute(context, this.reflector)) {
      return true;
    }

    const token: IAuthToken = {
      accessToken: extractAccessTokenFromHeader(request),
      refreshToken: extractRefreshTokenFromHeader(request),
    };

    if (await this.sessionService.isTokenRevoke(token)) {
      throw new TokenRevokeException();
    }
    return true;
  }
}
