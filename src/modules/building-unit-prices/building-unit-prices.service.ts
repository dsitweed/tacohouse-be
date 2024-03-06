import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingUnitPriceDto } from './dto/create-building-unit-price.dto';
import { UpdateBuildingUnitPriceDto } from './dto/update-building-unit-price.dto';
import { PrismaService } from 'nestjs-prisma';
import { QueryFindAllBuildingUnitPriceDto } from './dto';

@Injectable()
export class BuildingUnitPricesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createBuildingUnitPriceDto: CreateBuildingUnitPriceDto,
  ) {
    const { buildingId, name } = createBuildingUnitPriceDto;

    const building = await this.prisma.building.findUnique({
      where: { id: buildingId, ownerId: userId },
    });
    if (!building) {
      throw new NotFoundException('Not found building');
    }

    const isDuplicateName = await this.prisma.buildingUnitPrice.findUnique({
      where: { buildingId_name: { buildingId, name } },
    });
    if (isDuplicateName) {
      throw new BadRequestException('Unit name cannot be duplicated');
    }

    return this.prisma.buildingUnitPrice.create({
      data: { ...createBuildingUnitPriceDto },
    });
  }

  async findAll(query: QueryFindAllBuildingUnitPriceDto) {
    const { buildingId, skip, take } = query;

    return this.prisma.buildingUnitPrice.findMany({
      where: { buildingId },
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const unitPrice = await this.prisma.buildingUnitPrice.findUnique({
      where: { id },
    });
    if (!unitPrice) {
      throw new NotFoundException('Not found building unit price');
    }

    return unitPrice;
  }

  async update(
    userId: number,
    id: number,
    updateBuildingUnitPriceDto: UpdateBuildingUnitPriceDto,
  ) {
    const { name } = updateBuildingUnitPriceDto;
    const unitPrice = await this.prisma.buildingUnitPrice.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!unitPrice) {
      throw new NotFoundException(
        'Not found Unit price or You not have permission',
      );
    }

    const isDuplicateName = await this.isDuplicateUnitName(
      unitPrice.buildingId,
      name,
      unitPrice.id,
    );
    if (isDuplicateName) {
      throw new BadRequestException(
        'Unit price name in 1 building cannot be duplicated',
      );
    }

    return this.prisma.buildingUnitPrice.update({
      where: { id: id },
      data: {
        ...updateBuildingUnitPriceDto,
      },
    });
  }

  async remove(userId: number, id: number) {
    const unitPrice = await this.prisma.buildingUnitPrice.findUnique({
      where: {
        id: id,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!unitPrice) {
      throw new NotFoundException(
        'Unit price is not found or You not have permission',
      );
    }

    return this.prisma.$transaction([
      this.prisma.roomUnitPrice.deleteMany({
        where: {
          buildingUnitPriceId: id,
        },
      }),
      this.prisma.buildingUnitPrice.delete({
        where: { id: id },
      }),
    ]);
  }

  /* HELP FUNCTION */

  // check Unit price exits with constrain unit price unique [name, building.Id]
  private async isDuplicateUnitName(
    buildingId: number,
    unitName: string | null,
    buildingUnitPriceId: number,
  ) {
    if (!unitName) return false;

    const exitsUnitPrice = await this.prisma.buildingUnitPrice.findUnique({
      where: { buildingId_name: { buildingId, name: unitName } },
    });
    if (exitsUnitPrice && exitsUnitPrice.id !== buildingUnitPriceId)
      return true;
    return false;
  }
}
