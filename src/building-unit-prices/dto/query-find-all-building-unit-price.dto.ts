import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Constant } from 'src/shared/constants';

export class QueryFindAllBuildingUnitPriceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // If Client pass string -> convert to type number
  limit?: number = Constant.DEFAULT_LIMIT;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = Constant.DEFAULT_OFFSET;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  buildingId: number;
}
