import { Type } from 'class-transformer';
import {
  IsEnum,
  isNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { ESimpleOrderBy } from 'src/common/enum/search-opt.enum';

export class GetPostDTO {
  @IsEnum(ESimpleOrderBy)
  orderBy: ESimpleOrderBy;

  @ValidateIf((o: GetPostDTO) => isNotEmpty(o.latestLoadID))
  @IsUUID(4)
  latestLoadID?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;
}
