import { IsInt, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/query.dto';

export class QueryFindAllFacilityDto extends BaseQueryDto {
  @IsOptional()
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsInt()
  facilityTypeId?: number;
}
