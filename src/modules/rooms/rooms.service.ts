import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuildingType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/common/dto';
import { BuildingsService } from 'src/modules/buildings/buildings.service';
import {
  CreateRoomDto,
  GetListRoomQueryDto,
  GetOwnerInfoResDto,
  UpdateRoomDto,
} from './contracts';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private buildingService: BuildingsService,
  ) {}

  async createRoom(userId: number, data: CreateRoomDto) {
    const { name, buildingId } = data;

    const building = await this.buildingService.findOne(
      userId,
      data.buildingId,
    );

    await this.checkDuplicateRoomName(name, buildingId);

    const response = await this.prisma.$transaction(async (tx) => {
      const newRoom = await tx.room.create({ data });

      if (building.type === BuildingType.HOSTEL) {
        tx.roomUnitPrice.createMany({
          data: building.buildingUnitPrices.map((item) => ({
            before: 0,
            current: 0,
            roomId: newRoom.id,
            buildingUnitPriceId: item.id,
          })),
        });
      }

      return newRoom;
    });

    return response.id;
  }

  async getListRoom(query: GetListRoomQueryDto): Promise<PaginationDto> {
    const { buildingId, take, skip, isActive } = query;

    const [count, items] = await this.prisma.$transaction([
      this.prisma.room.count({ where: { buildingId, isActive } }),
      this.prisma.room.findMany({
        skip,
        take,
        where: { buildingId, isActive },
        include: {
          tenants: true,
          roomUnitPrices: {
            include: {
              buildingUnitPrice: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          building: {
            select: {
              type: true,
              address: true,
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return { count, items };
  }

  async getRoomInfo(id: number) {
    // Check the room belong to the current user
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        tenants: true,
        roomUnitPrices: true,
        facilities: true,
        building: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Not found room!');
    }

    return room;
  }

  async updateRoom(ownerId: number, id: number, data: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { id, building: { ownerId } },
    });

    if (!room) {
      throw new NotFoundException('Not found room!');
    }

    await this.checkDuplicateRoomName(data.name, room.buildingId, id);

    return this.prisma.room.update({ where: { id }, data });
  }

  async remove(userId: number, id: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    await this.prisma.$transaction([
      this.prisma.facility.deleteMany({
        where: { roomId: id },
      }),
      this.prisma.invoice.deleteMany({
        where: { roomId: id },
      }),
      this.prisma.roomUnitPrice.deleteMany({
        where: { roomId: id },
      }),
      this.prisma.room.delete({
        where: { id },
      }),
    ]);

    return room;
  }

  async getOwnerInfo(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        building: {
          include: {
            owner: true,
          },
        },
      },
    });

    return plainToInstance(GetOwnerInfoResDto, room.building.owner);
  }

  /**
   * Check if room name in the same building is duplicated
   */
  private async checkDuplicateRoomName(
    name: string | null,
    buildingId: number,
    roomId?: number,
  ) {
    if (!name) return;

    const existingRoom = await this.prisma.room.findUnique({
      where: { buildingId_name: { buildingId, name } },
    });

    if (existingRoom && existingRoom.id !== roomId) {
      throw new BadRequestException('Room name cannot be duplicated');
    }
  }
}
