import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtSignOptions, JwtService as NestJWTService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { IJwtDecodeOptions } from '../interfaces/jwt.interface';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: NestJWTService) {}

  async sign(payload: object, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload, options);
  }

  async decode(token: string, options?: IJwtDecodeOptions) {
    try {
      await this.jwtService.verify(token, options.jwtVerifyOptions);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token Expired!');
      }
      throw new UnauthorizedException('Invalid token');
    }
    return this.jwtService.decode(token, options.decodeOptions);
  }
}
