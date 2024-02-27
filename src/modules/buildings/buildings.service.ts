import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';

@Injectable()
export class BuildingsService {
  constructor(private prisma: PrismaService) {}

  async createBuilding(userId: number, data: CreateBuildingDto) {
    const building = await this.prisma.building.findUnique({
      where: {
        ownerId_name: { ownerId: userId, name: data.name },
      },
    });

    if (building) {
      throw new BadRequestException('Building names cannot be duplicated');
    }

    return this.prisma.building.create({
      data: {
        ownerId: userId,
        ...data,
      },
    });
  }

  async getListBuilding(userId: number) {
    return this.prisma.building.findMany({
      where: { ownerId: userId },
      include: {
        rooms: {
          include: {
            tenants: true,
          },
        },
      },
      orderBy: {
        rooms: {
          _count: 'desc',
        },
      },
    });
  }

  async getBuilding(userId: number, id: number) {
    const building = await this.prisma.building.findUnique({
      where: { id, ownerId: userId },
      include: {
        rooms: true,
        buildingUnitPrices: true,
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return building;
  }

  async updateBuilding(
    userId: number,
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ) {
    const building = await this.getBuilding(userId, id);

    await this.checkDuplicateBuildingName(updateBuildingDto.name, userId, id);

    return this.prisma.building.update({
      where: { id: building.id },
      data: {
        ...updateBuildingDto,
      },
    });
  }

  // VERY VERY DANGEROUS FUNCTION
  async remove(userId: number, id: number) {
    const building = await this.getBuilding(userId, id);

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return this.prisma.$transaction([
      this.prisma.invoice.deleteMany({
        where: {
          buildingId: building.id,
        },
      }),

      this.prisma.facility.deleteMany({
        where: {
          room: {
            buildingId: building.id,
          },
        },
      }),

      this.prisma.roomUnitPrice.deleteMany({
        where: {
          buildingUnitPrice: {
            buildingId: building.id,
          },
        },
      }),

      this.prisma.buildingUnitPrice.deleteMany({
        where: { buildingId: building.id },
      }),

      this.prisma.room.deleteMany({
        where: { buildingId: building.id },
      }),

      this.prisma.building.delete({
        where: { id: building.id },
      }),
    ]);
  }

  private async checkDuplicateBuildingName(
    name: string | null,
    ownerId: number,
    buildingId: number,
  ) {
    if (!name) return;

    const existingBuilding = await this.prisma.building.findUnique({
      where: {
        ownerId_name: { ownerId, name },
      },
    });

    if (existingBuilding && existingBuilding.id !== buildingId) {
      throw new BadRequestException('Building names cannot be duplicated');
    }
  }
}
