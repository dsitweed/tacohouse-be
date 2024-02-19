import { OmitType } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsInt()
  total: number;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @IsNotEmpty()
  @IsInt()
  invoiceTypeId: number;

  @IsNotEmpty()
  @IsInt()
  buildingId: number;

  @IsOptional()
  tenantIds: number[];
}

export class CreateCurrentMonthRentalInvoiceDto extends OmitType(
  CreateInvoiceDto,
  ['invoiceTypeId'] as const,
) {
  @IsNotEmpty()
  tenantIds: number[];
}
