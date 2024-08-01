import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { RefreshTokenEntity } from 'src/common/entities/post/refresh-token.entity';
import { EntityManager, Repository } from 'typeorm';
import { IAuthTokenInfo } from './interfaces/token.interface';
import { JWTService } from 'src/common/services/jwt.service';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { AccessTokenEntity } from 'src/common/entities/post/access-token.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly jwtService: JWTService,
  ) {}

  async login(accessToken: string, refreshToken: string, user: UserEntity) {
    await this.entityManager.transaction(async (manager) => {
      const accessTokenInfo: IAuthTokenInfo = await this.jwtService.decode(
        accessToken,
        {
          jwtVerifyOptions: { secret: process.env.JWT_SECRET_ACCESS },
        },
      );

      const refreshTokenInfo: IAuthTokenInfo = await this.jwtService.decode(
        refreshToken,
        {
          jwtVerifyOptions: { secret: process.env.JWT_SECRET_REFRESH },
        },
      );

      const sessionToken = manager.create(RefreshTokenEntity, [
        {
          user: user,
          token: refreshToken,
          expiredAt: dayjs(refreshTokenInfo.exp).toDate(),
          accessToken: [
            {
              token: accessToken,
              expiredAt: dayjs(accessTokenInfo.exp).toDate(),
            },
          ],
        },
      ]);

      await manager.save(sessionToken);
    });
  }

  async createRefreshTokenSession(
    manager: EntityManager | Repository<RefreshTokenEntity>,
    user: UserEntity,
    refreshToken: string,
  ) {
    const rfTokenInfo: IAuthTokenInfo = await this.jwtService.decode(
      refreshToken,
      { jwtVerifyOptions: { secret: process.env.JWT_SECRET_REFRESH } },
    );
    const rfToken = this.entityManager.create(RefreshTokenEntity, [
      {
        token: refreshToken,
        expiredAt: dayjs(rfTokenInfo.exp).toDate(),
        user: user,
      },
    ]);

    if (
      manager instanceof Repository &&
      manager.target === RefreshTokenEntity
    ) {
      return await manager.save(rfToken);
    }

    if (manager instanceof EntityManager) {
      return await manager.save(rfToken);
    }
  }

  async createAccessTokenSession(
    manager: EntityManager | Repository<AccessTokenEntity>,
    rfToken: RefreshTokenEntity,
    accessToken: string,
  ) {
    const acTokenInfo: IAuthTokenInfo = await this.jwtService.decode(
      accessToken,
      {
        jwtVerifyOptions: { secret: process.env.JWT_SECRET_ACCESS },
      },
    );
    const acToken = this.entityManager.create(AccessTokenEntity, {
      token: accessToken,
      expiredAt: dayjs(acTokenInfo.exp).toDate(),
      refreshToken: rfToken,
    });

    if (manager instanceof Repository && manager.target === AccessTokenEntity) {
      return await manager.save(acToken);
    }

    if (manager instanceof EntityManager) {
      return await manager.save(acToken);
    }
  }
}
