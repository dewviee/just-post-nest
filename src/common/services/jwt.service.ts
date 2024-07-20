import { Injectable } from '@nestjs/common';
import { JwtSignOptions, JwtService as NestJWTService } from '@nestjs/jwt';
import { DecodeOptions } from 'jsonwebtoken';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: NestJWTService) {}

  async sign(payload: object, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload, options);
  }

  async decode(token: string, options?: DecodeOptions) {
    return this.jwtService.decode(token, options);
  }
}
