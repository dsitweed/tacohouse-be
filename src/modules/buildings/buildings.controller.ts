import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GetStaffId, Roles } from 'src/common/decorator';
import { IdNumberParams } from 'src/common/dto/query.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto, UpdateBuildingDto } from './contracts/requests/';
import { CreatedResponseDto } from 'src/common/dto/created-response.dto';

@Controller('buildings')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.MANAGER, UserRole.ADMIN)
@ApiTags('Buildings')
@ApiBearerAuth()
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create building' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatedResponseDto,
  })
  createBuilding(
    @GetStaffId() staffId: number,
    @Body() data: CreateBuildingDto,
  ) {
    return this.buildingsService.createBuilding(staffId, data);
  }

  @Get()
  @ApiOperation({ summary: "Get current user's buildings list" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreatedResponseDto,
  })
  getListBuilding(@GetStaffId() staffId: number) {
    return this.buildingsService.getListBuilding(staffId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get building info' })
  getBuilding(@GetStaffId() staffId: number, @Param() params: IdNumberParams) {
    return this.buildingsService.getBuilding(staffId, params.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update building info' })
  updateBuilding(
    @GetStaffId() staffId: number,
    @Param() params: IdNumberParams,
    @Body() data: UpdateBuildingDto,
  ) {
    return this.buildingsService.updateBuilding(staffId, params.id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete building' })
  remove(@GetStaffId() staffId: number, @Param() params: IdNumberParams) {
    return this.buildingsService.remove(staffId, params.id);
  }
}
