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
import { CreateRoomDto, GetListRoomQueryDto, UpdateRoomDto } from './dto';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private buildingService: BuildingsService,
  ) {}

  async create(userId: number, createRoomDto: CreateRoomDto) {
    const { name, buildingId } = createRoomDto;

    const building = await this.buildingService.findOne(
      userId,
      createRoomDto.buildingId,
    );

    // check room exits with constrain room unique [name, building.Id]
    const isDuplicateRoomName = await this.prisma.room.findUnique({
      where: { buildingId_name: { name, buildingId } },
    });
    if (isDuplicateRoomName) {
      throw new BadRequestException('Room name cannot duplicated');
    }

    // create new room
    const newRoom = await this.prisma.room.create({
      data: {
        ...createRoomDto,
      },
    });

    // create room unit price if room is belong to HOSTEL building
    if (building.type === BuildingType.HOSTEL) {
      building.buildingUnitPrices.forEach(async (item) => {
        await this.prisma.roomUnitPrice.create({
          data: {
            before: 0,
            current: 0,
            roomId: newRoom.id,
            buildingUnitPriceId: item.id,
          },
        });
      });
    }

    return newRoom;
  }

  async findAll(queryFindAllRoom: GetListRoomQueryDto) {
    const { buildingId, limit, offset, isActive } = queryFindAllRoom;

    const [count, items] = await this.prisma.$transaction([
      this.prisma.room.count({
        where: {
          buildingId: buildingId,
          isActive: isActive,
        },
      }),
      this.prisma.room.findMany({
        where: {
          buildingId: buildingId,
          isActive: isActive,
        },
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
        skip: offset,
        take: limit,
      }),
    ]);

    return plainToInstance(PaginationDto, { count, items });
  }

  async findOne(id: number) {
    // Check the room belong to the current user
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
      },
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

  async update(userId: number, id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!room) {
      throw new NotFoundException('Not found room!');
    }

    const isDuplicateName = await this.isDuplicateRoomName(
      updateRoomDto.name,
      room.buildingId,
      id,
    );

    if (isDuplicateName) {
      throw new BadRequestException('Room name cannot be duplicated');
    }

    return this.prisma.room.update({
      where: { id: room.id },
      data: {
        ...updateRoomDto,
      },
    });
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...owner } = room.building.owner;
    return owner;
  }

  /* HELP FUNCTION */

  /**
   * Check to true if the room name is duplicated
   * 1 building can not have 2 room have same name
   * @param name
   * @param buildingId
   * @returns boolean
   */
  private async isDuplicateRoomName(
    name: string | null,
    buildingId: number,
    roomId: number,
  ) {
    if (!name) return false;

    const existingRoom = await this.prisma.room.findUnique({
      where: { buildingId_name: { buildingId, name } },
    });

    if (existingRoom && existingRoom.id !== roomId) return true;
    else return false;
  }
}
