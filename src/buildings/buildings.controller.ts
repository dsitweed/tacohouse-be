import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { UserRole } from '@prisma/client';
import { GetUser, Roles } from 'src/common/decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.ADMIN)
@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createBuildingDto: CreateBuildingDto,
  ) {
    return this.buildingsService.create(userId, createBuildingDto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.buildingsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.buildingsService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(userId, id, updateBuildingDto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.remove(userId, id);
  }
}
