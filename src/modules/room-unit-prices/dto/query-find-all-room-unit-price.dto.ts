import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/query.dto';

export class QueryFindAllRoomUnitPriceDto extends BaseQueryDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  roomId: number;
}
