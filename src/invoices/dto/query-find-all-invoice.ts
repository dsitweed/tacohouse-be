import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Constant } from 'src/shared/constants';

export class QueryFindAllInvoiceDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // If Client pass string -> convert to type number
  limit?: number = Constant.LIMIT_20;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = Constant.DEFAULT_OFFSET;

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
