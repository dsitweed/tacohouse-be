import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GetStaffId, Roles } from 'src/common/decorator';
import { IdNumberParams } from 'src/common/dto/query.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { GetOwnerInfoResDto } from './contracts';
import {
  CreateRoomDto,
  GetListRoomQueryDto,
  UpdateRoomDto,
} from './contracts/input';
import { RoomsService } from './rooms.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create new room' })
  createRoom(
    @GetStaffId() staffId: number,
    @Body() data: CreateRoomDto,
  ): Promise<number> {
    return this.roomsService.createRoom(staffId, data);
  }

  /**
   * Just manager can see multiple room
   * Now not have route for USER, OR TENANT
   */
  @Get()
  @ApiOperation({ summary: 'Get list room by buildingId' })
  getListRoom(@Query() query: GetListRoomQueryDto) {
    return this.roomsService.getListRoom(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room info' })
  getRoomInfo(@Param() params: IdNumberParams) {
    return this.roomsService.getRoomInfo(params.id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update room info' })
  updateRoom(
    @GetStaffId() staffId: number,
    @Param() params: IdNumberParams,
    @Body() data: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(staffId, params.id, data);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete room' })
  deleteRoom(@GetStaffId() staffId: number, @Param() params: IdNumberParams) {
    return this.roomsService.remove(staffId, params.id);
  }

  @Get(':id/owner')
  @ApiOperation({ summary: "Get room's owner info" })
  getOwnerInfo(@Param() params: IdNumberParams): Promise<GetOwnerInfoResDto> {
    return this.roomsService.getOwnerInfo(params.id);
  }
}
