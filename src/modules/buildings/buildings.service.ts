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

  async create(userId: number, createBuildingDto: CreateBuildingDto) {
    const building = await this.prisma.building.findUnique({
      where: {
        ownerId_name: { ownerId: userId, name: createBuildingDto.name },
      },
    });

    if (building) {
      throw new BadRequestException('Building names cannot be duplicated');
    }

    return this.prisma.building.create({
      data: {
        ownerId: userId,
        ...createBuildingDto,
      },
    });
  }

  async findAll(userId: number) {
    // Return buildings that belongs
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

  async findOne(userId: number, id: number) {
    const building = await this.prisma.building.findUnique({
      where: { id: id, ownerId: userId },
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

  async update(
    userId: number,
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ) {
    const building = await this.findOne(userId, id);

    const isDuplicateName = await this.isDuplicateBuildingName(
      updateBuildingDto.name,
      userId,
      id,
    );

    if (isDuplicateName) {
      throw new BadRequestException('Building names cannot be duplicated');
    }

    return this.prisma.building.update({
      where: { id: building.id },
      data: {
        ...updateBuildingDto,
      },
    });
  }

  // VERY VERY DANGEROUS FUNCTION
  async remove(userId: number, id: number) {
    const building = await this.findOne(userId, id);

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

  /* HELP FUNCTION */

  /**
   * Check to true if the building name is duplicated
   * 1 owner can not have 2 building have same name
   * @param name
   * @param ownerId
   * @param buildingId
   * @returns boolean
   */
  private async isDuplicateBuildingName(
    name: string | null,
    ownerId: number,
    buildingId: number,
  ) {
    if (!name) return false;

    const existingBuilding = await this.prisma.building.findUnique({
      where: {
        ownerId_name: { ownerId: ownerId, name: name },
      },
    });
    if (existingBuilding && existingBuilding.id !== buildingId) return true;
    else return false;
  }
}
