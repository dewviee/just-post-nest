import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTodoDto {
  @Length(1, 120)
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTodoItemDto)
  items: CreateTodoItemDto[];
}

export class CreateTodoItemDto {
  @Max(32767)
  @Min(0)
  @IsNumber()
  order: number;

  @Length(0, 255)
  @IsString()
  content: string;
}
