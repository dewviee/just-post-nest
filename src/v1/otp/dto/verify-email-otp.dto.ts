import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailOtpDto {
  @IsAlphanumeric()
  @Length(6, 6)
  code: string;

  @IsString()
  @IsNotEmpty()
  ref: string;
}
