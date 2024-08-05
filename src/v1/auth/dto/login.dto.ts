import { IsString, MaxLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @MaxLength(320)
  identifier: string;

  @IsString()
  @MaxLength(100)
  password: string;
}
