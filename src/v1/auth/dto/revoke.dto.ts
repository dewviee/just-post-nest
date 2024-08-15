import { IsUUID } from 'class-validator';

export class RevokeTokenDTO {
  @IsUUID(4)
  id: string;
}
