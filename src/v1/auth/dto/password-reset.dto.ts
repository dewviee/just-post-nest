import { IsString, MaxLength } from 'class-validator';

export class RequestPasswordResetDto {
  @IsString()
  @MaxLength(320)
  email: string;
}

