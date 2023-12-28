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
import { InvoicesService } from './invoices.service';
import {
  CreateCurrentMonthRentalInvoiceDto,
  CreateInvoiceDto,
} from './dto/create-invoice.dto';
import {
  UpdateCurrentMonthRentalInvoiceDto,
  UpdateInvoiceDto,
} from './dto/update-invoice.dto';
import { JwtGuard, RolesGuard } from 'src/common/guard';
import { GetUser, Roles } from 'src/common/decorator';
import { UserRole } from '@prisma/client';
import { QueryFindAllInvoiceDto } from './dto';

@UseGuards(JwtGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(userId, createInvoiceDto);
  }

  @Get()
  findAll(@Query() query: QueryFindAllInvoiceDto) {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(userId, id, updateInvoiceDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(userId, id);
  }

  @Get(':roomId/current-month')
  getCurrentMonthRentalInvoice(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.invoicesService.getCurrentMonthRentalInvoice(roomId);
  }

  @Patch(':roomId/current-month')
  updateCurrentMonthRentalInvoice(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() dto: UpdateCurrentMonthRentalInvoiceDto,
  ) {
    return this.invoicesService.updateCurrentMonthRentalInvoice(roomId, dto);
  }

  /**
   * Create the current month's room rental invoice for the provided RoomId
   */
  @Post(':roomId/current-month')
  createCurrentMonthRentalInvoice(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() dto: CreateCurrentMonthRentalInvoiceDto,
  ) {
    return this.invoicesService.createCurrentMonthRentalInvoice(roomId, dto);
  }
}
