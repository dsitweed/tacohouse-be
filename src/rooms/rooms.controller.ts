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
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { GetUser, Roles } from 'src/common/decorator';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { UserRole } from '@prisma/client';
import { CreateRoomDto, QueryFindAllRoomDto, UpdateRoomDto } from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  create(@GetUser('id') userId: number, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(userId, createRoomDto);
  }

  /**
   *
   * @param managerId
   * @param queryFindAllRoom
   * @returns rooms,
   * Just manager can see multiple room
   * Now not have route for USER, OR TENANT
   */
  @Get()
  findAll(@Query() queryFindAllRoom: QueryFindAllRoomDto) {
    return this.roomsService.findAll(queryFindAllRoom);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(userId, id, updateRoomDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(userId, id);
  }
}
