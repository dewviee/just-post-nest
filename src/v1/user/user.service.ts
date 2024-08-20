import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Equal, Repository } from 'typeorm';
import { PasswordService } from '../../common/services/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly acTokenRepo: Repository<AccessTokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
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

  async changeUserPassword(userID: string, newPassword: string) {
    const [hashedPassword, user] = await Promise.all([
      this.passwordService.hash(newPassword),
      this.userRepo.findOneBy({ id: Equal(userID) }),
    ]);

    if (!user) {
      throw new BadRequestException('user id not found');
    }

    user.password = hashedPassword;
    return await this.userRepo.save(user);
  }
}
