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
import { ManagersService } from './managers.service';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { GetUser, Roles } from 'src/common/decorator';
import { UserRole } from '@prisma/client';
import { CreateTenantDto, GetListRoomQueryDto, UpdateTenantDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Managers')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.MANAGER)
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get('buildings')
  findAllBuildings(@GetUser('id') userId: number) {
    return this.managersService.findAllBuildings(userId);
  }

  @Get('rooms')
  findAllRooms(
    @GetUser('id') userId: number,
    @Query() query: GetListRoomQueryDto,
  ) {
    return this.managersService.findAllRooms(userId, query);
  }

  @Get('tenants')
  findAllTenants(@GetUser('id') userId: number) {
    return this.managersService.findAllTenants(userId);
  }

  @Get('tenant/:id')
  findOneTenant(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.managersService.findOneTenant(userId, id);
  }

  @Post('tenant')
  createTenant(@GetUser('id') userId: number, @Body() dto: CreateTenantDto) {
    return this.managersService.createTenant(userId, dto);
  }

  @Patch('tenant/:id')
  updateTenant(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.managersService.updateTenant(userId, id, dto);
  }

  @Delete('tenant/:id')
  deleteTenant(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.managersService.deleteTenant(userId, id);
  }
}
