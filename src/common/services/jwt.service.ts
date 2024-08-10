import { Injectable } from '@nestjs/common';
import { JwtSignOptions, JwtService as NestJWTService } from '@nestjs/jwt';
import { IJwtDecodeOptions } from '../interfaces/jwt.interface';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: NestJWTService) {}

  async sign(payload: object, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload, options);
  }

  async decode(token: string, options?: IJwtDecodeOptions) {
    await this.jwtService.verify(token, options.jwtVerifyOptions);
    return this.jwtService.decode(token, options.decodeOptions);
  }
}
