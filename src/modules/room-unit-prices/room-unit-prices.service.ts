import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomUnitPriceDto } from './dto/create-room-unit-price.dto';
import { UpdateRoomUnitPriceDto } from './dto/update-room-unit-price.dto';
import { QueryFindAllRoomUnitPriceDto } from './dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoomUnitPricesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createRoomUnitPriceDto: CreateRoomUnitPriceDto) {
    const { roomId, buildingUnitPriceId } = createRoomUnitPriceDto;
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
        building: {
          ownerId: userId,
        },
      },
    });
    // Check permission add room unit price for room
    if (!room) {
      throw new NotFoundException('Not found room or Access denied');
    }

    // Check room had room unit price ? (1 room have 1 room unit price - 1 building unit price)
    const isDuplicateRoomUnitPrice = await this.prisma.roomUnitPrice.findUnique(
      {
        where: {
          roomId_buildingUnitPriceId: {
            roomId: roomId,
            buildingUnitPriceId: buildingUnitPriceId,
          },
        },
      },
    );
    if (isDuplicateRoomUnitPrice) {
      throw new BadRequestException(
        '1 Room cannot have duplicate room unit price',
      );
    }

    return this.prisma.roomUnitPrice.create({
      data: { ...createRoomUnitPriceDto },
    });
  }

  async findAll(query: QueryFindAllRoomUnitPriceDto) {
    return this.prisma.roomUnitPrice.findMany({
      where: {
        roomId: query.roomId,
      },
      skip: query.offset,
      take: query.limit,
    });
  }

  async findOne(id: number) {
    const roomUnitPrice = await this.prisma.roomUnitPrice.findUnique({
      where: { id: id },
    });
    if (!roomUnitPrice) {
      throw new NotFoundException('Not found room unit price');
    }

    return roomUnitPrice;
  }

  async update(
    userId: number,
    id: number,
    updateRoomUnitPriceDto: UpdateRoomUnitPriceDto,
  ) {
    const roomUnitPrice = await this.prisma.roomUnitPrice.findUnique({
      where: {
        id: id,
        room: {
          building: {
            ownerId: userId,
          },
        },
      },
    });
    if (!roomUnitPrice) {
      throw new NotFoundException('Not found room unit price of Access denied');
    }

    return this.prisma.roomUnitPrice.update({
      where: { id: id },
      data: { ...updateRoomUnitPriceDto },
    });
  }

  async remove(userId: number, id: number) {
    const roomUnitPrice = await this.prisma.roomUnitPrice.findUnique({
      where: {
        id: id,
        room: {
          building: {
            ownerId: userId,
          },
        },
      },
    });
    if (!roomUnitPrice) {
      throw new NotFoundException('Not found room unit price');
    }

    return this.prisma.$transaction([
      this.prisma.roomUnitPrice.delete({
        where: { id: id },
      }),
    ]);
  }
}
