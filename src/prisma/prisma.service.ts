import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.facility.deleteMany(),
      this.facilityType.deleteMany(),
      this.roomUnitPrice.deleteMany(),
      this.buildingUnitPrice.deleteMany(),
      this.invoice.deleteMany(),
      this.invoiceType.deleteMany(),
      this.room.deleteMany(),
      this.building.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
