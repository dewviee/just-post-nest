import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  extractAccessTokenFromHeader,
  extractRefreshTokenFromHeader,
} from 'src/utils/extract-token-from-request';
import { IAuthToken } from '../interfaces/jwt.interface';

export const Token = createParamDecorator(
  (ctx: ExecutionContext): IAuthToken => {
    const request = ctx.switchToHttp().getRequest();

    const accessToken = extractAccessTokenFromHeader(request);
    const refreshToken = extractRefreshTokenFromHeader(request);

    return { accessToken, refreshToken };
  },
);
