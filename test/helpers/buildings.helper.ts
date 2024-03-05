import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Building, BuildingType, PrismaClient } from '@prisma/client';

export class BuildingsHelper {
  private app: INestApplication;
  private prisma: PrismaClient;
  constructor() {
    this.app = global.testContext.app;
    this.prisma = global.testContext.prisma;
  }

  async createBuilding(ownerId: number, override: Partial<Building>) {
    return this.prisma.building.create({
      data: {
        ownerId,
        name: faker.string.alpha(8),
        address: faker.location.streetAddress(),
        ward: 'Bách Khoa',
        district: 'Quận Hai Bà Trưng',
        province: 'Thành phố Hà Nội',
        type: BuildingType.HOSTEL,
        ...override,
      },
    });
  }
}
