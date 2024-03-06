import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/query.dto';

export class GetListRoomQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  buildingId?: number;
}
