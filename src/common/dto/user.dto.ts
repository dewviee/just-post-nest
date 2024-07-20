import {
  IsEmail,
  isNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UserDTO {
  @ValidateIf((req: UserDTO) => isNotEmpty(req.id))
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(100)
  password: string;

  @IsString()
  @Length(1, 16)
  username: string;
}
