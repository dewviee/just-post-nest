import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/access-token.entity';
import { Equal, Repository } from 'typeorm';

export class UserService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly acTokenRepo: Repository<AccessTokenEntity>,
  ) {}

  async getUserInfoFromAccessToken(acTokenStr: string) {
    const accessToken = await this.acTokenRepo.findOne({
      select: {
        id: true,
        token: true,
        refreshToken: {
          id: true,
          user: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      relations: {
        refreshToken: {
          user: true,
        },
      },
      where: {
        token: Equal(acTokenStr),
      },
    });

    const user = accessToken?.refreshToken?.user;
    return user;
  }
}
