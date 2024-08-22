import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  extractAccessTokenFromHeader,
  extractRefreshTokenFromHeader,
} from 'src/utils/extract-token-from-request';
import { isPublicRoute } from 'src/utils/is-public-route';
import { SessionService } from 'src/v1/auth/session.service';
import { EAuthErrCode } from '../enum/auth.enum';
import { CustomErrorException } from '../exceptions/custom-error.exception';
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

    if (!token.accessToken) throw this.invalidAccessTokenError();
    if (!token.refreshToken) throw this.invalidRefreshTokenError();

    if (await this.sessionService.isTokenRevoke(token)) {
      throw new CustomErrorException(
        'token has been revoked',
        HttpStatus.UNAUTHORIZED,
        { errorCode: EAuthErrCode.ACCESS_TOKEN_REVOKE },
      );
    }
    return true;
  }

  private invalidAccessTokenError() {
    return new CustomErrorException(
      'invalid access token',
      HttpStatus.UNAUTHORIZED,
      { errorCode: EAuthErrCode.ACCESS_TOKEN_INVALID },
    );
  }

  private invalidRefreshTokenError() {
    return new CustomErrorException(
      'invalid refresh token',
      HttpStatus.UNAUTHORIZED,
      { errorCode: EAuthErrCode.REFRESH_TOKEN_INVALID },
    );
  }
}
