import { IsString, MaxLength } from 'class-validator';

export class RequestPasswordResetDto {
  @IsString()
  @MaxLength(320)
  email: string;
}

export class PasswordResetDto {
  @IsString()
  token: string;

  @IsString()
  @MaxLength(100)
  password: string;
}
