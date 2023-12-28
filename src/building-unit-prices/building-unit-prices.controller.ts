import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BuildingUnitPricesService } from './building-unit-prices.service';
import { CreateBuildingUnitPriceDto } from './dto/create-building-unit-price.dto';
import { UpdateBuildingUnitPriceDto } from './dto/update-building-unit-price.dto';
import { GetUser, Roles } from 'src/common/decorator';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { QueryFindAllBuildingUnitPriceDto } from './dto';
import { UserRole } from '@prisma/client';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.MANAGER)
@Controller('building-unit-prices')
export class BuildingUnitPricesController {
  constructor(
    private readonly buildingUnitPricesService: BuildingUnitPricesService,
  ) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createBuildingUnitPriceDto: CreateBuildingUnitPriceDto,
  ) {
    return this.buildingUnitPricesService.create(
      userId,
      createBuildingUnitPriceDto,
    );
  }

  @Get()
  findAll(@Query() query: QueryFindAllBuildingUnitPriceDto) {
    return this.buildingUnitPricesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buildingUnitPricesService.findOne(id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuildingUnitPriceDto: UpdateBuildingUnitPriceDto,
  ) {
    return this.buildingUnitPricesService.update(
      userId,
      id,
      updateBuildingUnitPriceDto,
    );
  }

  @Delete(':id')
  removeAllBuildingServices(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.buildingUnitPricesService.remove(userId, id);
  }
}
