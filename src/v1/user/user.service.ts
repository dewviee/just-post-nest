import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/common/entities/post/session-access-token.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import { PasswordService } from '../../common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async updateUserProfile(id: string, body: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    const isUserExist = await this.findConflictingUserInfo(body);

    if (isUserExist.filter((o) => o.id !== user.id).length > 0) {
      throw new BadRequestException('username or email already exist');
    }

    if (body.email) user.email = body.email;
    if (body.username) user.username = body.username;

    await this.userRepo.save(user);
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

  async getUserBy(options: FindOptionsWhere<UserEntity>) {
    return await this.userRepo.findOneBy(options);
  }

  findConflictingUserInfo(body: CreateUserDto | UpdateUserDto) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email OR LOWER(user.username) = LOWER(:username)', {
        email: body.email,
        username: body.username,
      })
      .getMany();
  }
}
