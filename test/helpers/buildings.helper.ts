import { INestApplication } from '@nestjs/common';
import { Building, PrismaClient } from '@prisma/client';
import { fakeCreateBuilding } from '../mocks';

export class BuildingsHelper {
  private app: INestApplication;
  private prisma: PrismaClient;
  constructor() {
    this.app = global.testContext.app;
    this.prisma = global.testContext.prisma;
  }

  async createBuilding(ownerId: number, override: Partial<Building> = {}) {
    return this.prisma.building.create({
      data: {
        ownerId,
        ...fakeCreateBuilding(override),
      },
    });
  }

  async clearBuildings() {
    await this.prisma.building.deleteMany();
  }
}
