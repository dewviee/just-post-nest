import { Body, Controller, Get, Put } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { ChangeUserPasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  async getUserInfo(@User() user: UserEntity) {
    return user;
  }

  @Put('/change-password')
  async changeUserPassword(
    @Body() body: ChangeUserPasswordDto,
    @User() user: UserEntity,
  ) {
    await this.userService.changeUserPassword(user.id, body.password);
  }
}
