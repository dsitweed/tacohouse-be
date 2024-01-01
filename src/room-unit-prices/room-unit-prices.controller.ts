import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomUnitPricesService } from './room-unit-prices.service';
import { CreateRoomUnitPriceDto } from './dto/create-room-unit-price.dto';
import { UpdateRoomUnitPriceDto } from './dto/update-room-unit-price.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { GetUser, Roles } from 'src/common/decorator';
import { UserRole } from '@prisma/client';
import { QueryFindAllRoomUnitPriceDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Room unit prices')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.ADMIN)
@Controller('room-unit-prices')
export class RoomUnitPricesController {
  constructor(private readonly roomUnitPricesService: RoomUnitPricesService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createRoomUnitPriceDto: CreateRoomUnitPriceDto,
  ) {
    return this.roomUnitPricesService.create(userId, createRoomUnitPriceDto);
  }

  @Get()
  findAll(@Query() query: QueryFindAllRoomUnitPriceDto) {
    return this.roomUnitPricesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomUnitPricesService.findOne(id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomUnitPriceDto: UpdateRoomUnitPriceDto,
  ) {
    return this.roomUnitPricesService.update(
      userId,
      id,
      updateRoomUnitPriceDto,
    );
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.roomUnitPricesService.remove(userId, id);
  }
}
