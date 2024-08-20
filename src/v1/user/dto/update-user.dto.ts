import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { CreateUserDto } from 'src/v1/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmpty()
  id: string;

  @IsEmpty()
  password: string;
}
