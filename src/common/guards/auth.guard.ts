import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { extractAccessTokenFromHeader } from 'src/utils/extract-token-from-request';
import { isPublicRoute } from 'src/utils/is-public-route';
import { UserService } from 'src/v1/user/user.service';
import { EAuthErrCode } from '../enum/auth.enum';
import { CustomErrorException } from '../exceptions/custom-error.exception';
import { JWTService } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublicRoute(context, this.reflector)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractAccessTokenFromHeader(request);
    if (!token) {
      this.errorTokenNotFound();
    }

    try {
      await this.jwtService.decode(token, {
        jwtVerifyOptions: { secret: process.env.JWT_SECRET_ACCESS },
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new CustomErrorException(error, HttpStatus.UNAUTHORIZED, {
          errorCode: EAuthErrCode.ACCESS_TOKEN_EXPIRED,
        });
      }
      if (error instanceof JsonWebTokenError)
        throw new CustomErrorException(error, HttpStatus.UNAUTHORIZED, {
          errorCode: EAuthErrCode.ACCESS_TOKEN_INVALID,
        });

      throw new InternalServerErrorException(error);
    }

    request['user'] = await this.userService.getUserInfoFromAccessToken(token);

    return true;
  }

  private errorTokenNotFound() {
    throw new CustomErrorException('Token Not Found', HttpStatus.UNAUTHORIZED, {
      errorCode: EAuthErrCode.TOKEN_INVALID,
    });
  }
}
