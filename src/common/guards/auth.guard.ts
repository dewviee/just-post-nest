import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from '../services/jwt.service';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/v1/user/user.service';
import { extractAccessTokenFromHeader } from 'src/utils/extract-token-from-request';
import { isPublicRoute } from 'src/utils/is-public-route';

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
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.decode(token, {
        jwtVerifyOptions: { secret: process.env.JWT_SECRET_ACCESS },
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    request['user'] = await this.userService.getUserInfoFromAccessToken(token);

    return true;
  }
}
