import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @MaxLength(500)
  @IsString()
  content: string;
}
