import { PartialType, PickType } from '@nestjs/swagger';
import {
  CreateCurrentMonthRentalInvoiceDto,
  CreateInvoiceDto,
} from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(
  PickType(CreateInvoiceDto, ['total', 'status', 'invoiceTypeId'] as const),
) {}

export class UpdateCurrentMonthRentalInvoiceDto extends PartialType(
  PickType(CreateCurrentMonthRentalInvoiceDto, ['total', 'status'] as const),
) {}
