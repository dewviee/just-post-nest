import { Controller, Get } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  async getUserInfo(@User() user: UserEntity) {
    return user;
  }
}
