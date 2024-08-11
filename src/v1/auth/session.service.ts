import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { RefreshTokenEntity } from 'src/common/entities/post/session-refresh-token.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { IAuthToken } from 'src/common/interfaces/jwt.interface';
import { JWTService } from 'src/common/services/jwt.service';
import { EntityManager, Equal, Repository } from 'typeorm';
import { IAuthTokenInfo } from './interfaces/token.interface';

@Injectable()
export class SessionService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly jwtService: JWTService,
    @InjectRepository(RefreshTokenEntity)
    private readonly rfTokenRepo: Repository<RefreshTokenEntity>,
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

      const sessionToken = manager.create(RefreshTokenEntity, {
        user: user,
        token: refreshToken,
        expiredAt: dayjs(refreshTokenInfo.exp).toDate(),
        accessToken: [
          {
            token: accessToken,
            expiredAt: dayjs(accessTokenInfo.exp).toDate(),
          },
        ],
      });

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

    return await this.acTokenRepo.save(acToken);
  }

  async isTokenRevoke(token: IAuthToken) {
    const accessToken = await this.entityManager.findOne(AccessTokenEntity, {
      select: {
        id: true,
        token: true,
        refreshToken: {
          id: true,
          token: true,
        },
      },
      relations: {
        refreshToken: true,
      },
      where: {
        token: Equal(token.accessToken),
        refreshToken: {
          token: Equal(token.refreshToken),
        },
      },
    });

    if (!accessToken) {
      return true;
    }
    return false;
  }

  async isRefreshTokenRevoke(token: string) {
    const refreshToken = await this.entityManager.findOneBy(
      RefreshTokenEntity,
      {
        token: Equal(token),
      },
    );

    if (refreshToken) {
      return false;
    }
    return true;
  }
}
