import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Constant } from 'src/shared/constants';

export class QueryFindAllFacilityDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // If Client pass string -> convert to type number
  limit?: number = Constant.DEFAULT_LIMIT;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = Constant.DEFAULT_OFFSET;

  @IsOptional()
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsInt()
  facilityTypeId?: number;
}
