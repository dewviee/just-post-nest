import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { RefreshTokenEntity } from 'src/common/entities/post/session-refresh-token.entity';
import { JWTService } from 'src/common/services/jwt.service';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly acTokenRepo: Repository<AccessTokenEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly rfTokenRepo: Repository<RefreshTokenEntity>,
    private readonly jwtService: JWTService,
  ) {}

  async findAccessTokenFromToken(accessTokenString: string) {
    return await this.acTokenRepo.findOneBy({
      token: Equal(accessTokenString),
    });
  }

  async findRefreshTokenFromToken(refreshTokenString: string) {
    return await this.rfTokenRepo.findOneBy({
      token: Equal(refreshTokenString),
    });
  }

  async generateAccessToken(payload: object) {
    return await this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        expiresIn: '30m',
        secret: process.env.JWT_SECRET_ACCESS,
      },
    );
  }

  async generateRefreshToken(payload: object) {
    return await this.jwtService.sign(
      { payload, type: 'refresh' },
      {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET_REFRESH,
      },
    );
  }
}
