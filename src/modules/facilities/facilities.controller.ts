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
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { UserRole } from '@prisma/client';
import { GetUser, Roles } from 'src/common/decorator';
import { QueryFindAllFacilityDto } from './dto';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    return this.facilitiesService.create(userId, createFacilityDto);
  }

  @Get()
  findAll(@Query() query: QueryFindAllFacilityDto) {
    return this.facilitiesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facilitiesService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    return this.facilitiesService.update(userId, id, updateFacilityDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.facilitiesService.remove(userId, id);
  }
}
