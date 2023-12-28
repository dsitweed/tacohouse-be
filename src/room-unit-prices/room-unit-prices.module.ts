import { Module } from '@nestjs/common';
import { RoomUnitPricesService } from './room-unit-prices.service';
import { RoomUnitPricesController } from './room-unit-prices.controller';

@Module({
  controllers: [RoomUnitPricesController],
  providers: [RoomUnitPricesService],
})
export class RoomUnitPricesModule {}
