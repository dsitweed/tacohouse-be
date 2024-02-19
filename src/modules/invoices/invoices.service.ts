import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCurrentMonthRentalInvoiceDto,
  CreateInvoiceDto,
} from './dto/create-invoice.dto';
import {
  UpdateCurrentMonthRentalInvoiceDto,
  UpdateInvoiceDto,
} from './dto/update-invoice.dto';
import { PrismaService } from 'nestjs-prisma';
import { QueryFindAllInvoiceDto } from './dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createInvoiceDto: CreateInvoiceDto) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: createInvoiceDto.roomId,
        building: {
          id: createInvoiceDto.buildingId,
          ownerId: userId,
        },
      },
    });
    if (!room) {
      throw new NotFoundException(
        'Not found room to add invoice or Access denied',
      );
    }

    return this.prisma.invoice.create({
      data: {
        ...createInvoiceDto,
      },
    });
  }

  async findAll(query: QueryFindAllInvoiceDto) {
    const { offset, limit, ...otherConditions } = query;

    return this.prisma.invoice.findMany({
      where: {
        ...otherConditions,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: id },
    });
    if (!invoice) {
      throw new NotFoundException('Not found invoice');
    }

    return invoice;
  }

  async update(userId: number, id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException('Not found invoice');
    }

    return this.prisma.invoice.update({
      where: { id: id },
      data: { ...updateInvoiceDto },
    });
  }

  async remove(userId: number, id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException('Not found invoice');
    }

    return this.prisma.$transaction([
      this.prisma.invoice.delete({
        where: { id: id },
      }),
    ]);
  }

  async getCurrentMonthRentalInvoice(roomId: number) {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    return this.prisma.invoice.findFirst({
      where: {
        roomId: roomId,
        invoiceType: {
          name: 'rental',
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  }

  async updateCurrentMonthRentalInvoice(
    roomId: number,
    dto: UpdateCurrentMonthRentalInvoiceDto,
  ) {
    const currentMonthInvoice = await this.getCurrentMonthRentalInvoice(roomId);

    if (!currentMonthInvoice) {
      throw new BadRequestException(
        'Need create current month rental invoice before',
      );
    }

    return this.prisma.invoice.update({
      where: { id: currentMonthInvoice.id },
      data: {
        ...dto,
      },
    });
  }

  async createCurrentMonthRentalInvoice(
    roomId: number,
    dto: CreateCurrentMonthRentalInvoiceDto,
  ) {
    const currentMonthInvoice = await this.getCurrentMonthRentalInvoice(roomId);
    if (currentMonthInvoice) {
      throw new BadRequestException(
        'Current month already have rental invoice!',
      );
    }

    const invoiceTypeRental = await this.prisma.invoiceType.findFirst({
      where: {
        name: 'rental',
      },
    });

    if (!invoiceTypeRental) {
      throw new BadRequestException('Need create InvoiceType rental before');
    }

    return this.prisma.invoice.create({
      data: {
        ...dto,
        invoiceTypeId: invoiceTypeRental.id,
      },
    });
  }
}
