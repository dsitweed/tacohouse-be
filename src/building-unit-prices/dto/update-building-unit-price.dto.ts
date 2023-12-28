import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBuildingUnitPriceDto } from './create-building-unit-price.dto';

export class UpdateBuildingUnitPriceDto extends PartialType(
  OmitType(CreateBuildingUnitPriceDto, ['buildingId'] as const),
) {}
