import { Module } from '@nestjs/common';
import { BuildingUnitPricesService } from './building-unit-prices.service';
import { BuildingUnitPricesController } from './building-unit-prices.controller';

@Module({
  controllers: [BuildingUnitPricesController],
  providers: [BuildingUnitPricesService],
})
export class BuildingUnitPricesModule {}
