import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtSignOptions, JwtService as NestJWTService } from '@nestjs/jwt';
import { DecodeOptions, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: NestJWTService) {}

  async sign(payload: object, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload, options);
  }

  async decode(token: string, options?: DecodeOptions) {
    try {
      await this.jwtService.verify(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token Expired!');
      }
      throw new UnauthorizedException('Invalid token');
    }
    return this.jwtService.decode(token, options);
  }
}
