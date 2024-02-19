import { IsInt, IsOptional } from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/query.dto';

export class QueryFindAllInvoiceDto extends BaseQueryDto {
  @IsOptional()
  @IsInt()
  roomId?: number;

  @IsOptional()
  @IsInt()
  buildingId?: number;

  @IsOptional()
  @IsInt()
  invoiceTypeId?: number;
}
