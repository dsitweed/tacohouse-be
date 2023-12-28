import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryFindAllFacilityDto } from './dto';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createFacilityDto: CreateFacilityDto) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: createFacilityDto.roomId,
        building: {
          ownerId: userId,
        },
      },
    });
    if (!room) {
      throw new NotFoundException('Not found room to add facility.');
    }

    return this.prisma.facility.create({
      data: {
        ...createFacilityDto,
      },
    });
  }

  async findAll(query: QueryFindAllFacilityDto) {
    const { limit, offset, ...otherConditions } = query;

    return this.prisma.facility.findMany({
      where: {
        ...otherConditions,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const facility = await this.prisma.facility.findUnique({
      where: { id: id },
    });
    if (!facility) {
      throw new NotFoundException('Not found facility');
    }

    return facility;
  }

  async update(
    userId: number,
    id: number,
    updateFacilityDto: UpdateFacilityDto,
  ) {
    const room = await this.prisma.facility.findUnique({
      where: {
        id: id,
        room: {
          building: {
            ownerId: userId,
          },
        },
      },
    });
    if (!room) {
      throw new NotFoundException('Not found facility');
    }

    return this.prisma.facility.update({
      where: { id: id },
      data: { ...updateFacilityDto },
    });
  }

  async remove(userId: number, id: number) {
    const facility = await this.prisma.facility.findUnique({
      where: {
        id: id,
        room: {
          building: {
            ownerId: userId, // Check permission
          },
        },
      },
    });
    if (!facility) {
      throw new NotFoundException('Not found facility');
    }

    return this.prisma.$transaction([
      this.prisma.facility.delete({
        where: { id: id },
      }),
    ]);
  }
}
