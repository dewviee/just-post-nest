import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(AccessTokenEntity)
    private readonly acTokenRepo: Repository<AccessTokenEntity>,
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
        expiredAt: dayjs(refreshTokenInfo.exp * 1000).toDate(),
        accessToken: [
          {
            token: accessToken,
            expiredAt: dayjs(accessTokenInfo.exp * 1000).toDate(),
          },
        ],
      });

      await manager.save(sessionToken);
    });
  }

  async createRefreshTokenSession(user: UserEntity, refreshToken: string) {
    const rfTokenInfo: IAuthTokenInfo = await this.jwtService.decode(
      refreshToken,
      { jwtVerifyOptions: { secret: process.env.JWT_SECRET_REFRESH } },
    );
    const rfToken = this.entityManager.create(RefreshTokenEntity, [
      {
        token: refreshToken,
        expiredAt: dayjs(rfTokenInfo.exp * 1000).toDate(),
        user: user,
      },
    ]);

    return await this.rfTokenRepo.save(rfToken);
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
      expiredAt: dayjs(acTokenInfo.exp * 1000).toDate(),
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

  async revokeRefreshToken(refreshTokenString: string) {
    const refreshToken = await this.rfTokenRepo.findOneBy({
      token: Equal(refreshTokenString),
    });

    if (!refreshToken) {
      throw new NotFoundException();
    }

    await this.entityManager.transaction(async (manager: EntityManager) => {
      await manager.delete(AccessTokenEntity, { refreshToken: refreshToken });
      await manager.delete(RefreshTokenEntity, { token: refreshToken.token });
    });
  }

  // TODO: Need to make this code not select all item at once. Can cause massive Read and Delete Query
  // TODO: And write better code. TOO MANY {}! ||orz|
  async revokeAllToken(user: UserEntity) {
    const refreshTokenEntities = await this.rfTokenRepo.find({
      relations: { user: true },
      select: {
        id: true,
        user: {},
      },
      where: {
        user: {
          id: Equal(user.id),
        },
      },
    });

    // Prepare data for queue query
    const rfTokenQueues = refreshTokenEntities.reduce((acc, rfToken, i) => {
      if (i % 10 === 0) {
        acc.push([]);
      }

      acc[acc.length - 1].push(rfToken);
      return acc;
    }, []);

    // Search All Access Token from all refresh token
    const acTokenEntities: AccessTokenEntity[] = [];
    for (const rfTokenList of rfTokenQueues) {
      const jobs = rfTokenList.map(async (rfToken: RefreshTokenEntity) => {
        const accessTokens = await this.acTokenRepo.find({
          select: {
            id: true,
            refreshToken: {},
          },
          where: {
            refreshToken: {
              id: Equal(rfToken.id),
            },
          },
          relations: {
            refreshToken: true,
          },
        });
        if (accessTokens) {
          accessTokens.forEach((acToken) => {
            acTokenEntities.push(acToken);
          });
        }
      });
      await Promise.all(jobs); // Wait for all jobs in the current batch to finish
    }

    // Prepare data for queue query
    const acTokenQueues = acTokenEntities.reduce((acc, acToken, i) => {
      if (i % 10 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(acToken);
      return acc;
    }, []);

    // Create transactions to remove all token
    await this.entityManager.transaction(async (manager: EntityManager) => {
      const acTokenJobs = acTokenQueues.map(
        async (acTokens: AccessTokenEntity[]) => {
          const jobs = acTokens.map((acToken) =>
            manager.delete(AccessTokenEntity, { id: acToken.id }),
          );

          await Promise.all(jobs);
        },
      );

      const rfTokenJobs = rfTokenQueues.map(
        async (rfTokens: RefreshTokenEntity[]) => {
          const jobs = rfTokens.map((rfToken) =>
            manager.delete(RefreshTokenEntity, { id: rfToken.id }),
          );

          await Promise.all(jobs);
        },
      );

      await Promise.all([...acTokenJobs, ...rfTokenJobs]);
    });
  }
}
