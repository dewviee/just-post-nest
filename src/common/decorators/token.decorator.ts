import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthToken } from '../interfaces/jwt.interface';
import {
  extractAccessTokenFromHeader,
  extractRefreshTokenFromHeader,
} from 'src/utils/extract-token-from-request';

export const Token = createParamDecorator(
  (ctx: ExecutionContext): IAuthToken => {
    const request = ctx.switchToHttp().getRequest();

    const accessToken = extractAccessTokenFromHeader(request);
    const refreshToken = extractRefreshTokenFromHeader(request);

    return { accessToken, refreshToken };
  },
);
