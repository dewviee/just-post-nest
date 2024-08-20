import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty } from 'class-validator';
import { UserDTO } from 'src/common/dto/user.dto';

export class UpdateUserDto extends PartialType(UserDTO) {
  @IsEmpty()
  id: string;

  @IsEmpty()
  password: string;
}
