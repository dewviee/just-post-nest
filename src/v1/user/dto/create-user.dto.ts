import { Transform } from 'class-transformer';
import {
  IsEmail,
  isNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ValidateIf((req: CreateUserDto) => isNotEmpty(req.id))
  @IsUUID()
  id: string;

  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(100)
  password: string;

  @IsString()
  @Length(1, 16)
  username: string;
}
