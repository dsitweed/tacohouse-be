import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoomUnitPriceDto } from './create-room-unit-price.dto';

export class UpdateRoomUnitPriceDto extends PartialType(
  OmitType(CreateRoomUnitPriceDto, ['buildingUnitPriceId', 'roomId'] as const),
) {}
