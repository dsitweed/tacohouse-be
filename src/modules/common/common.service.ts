import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}
  async getListProvince() {
    const results = await this.prisma.province.findMany();
    return results.map((item) => ({
      id: item.code,
      title: item.name,
    }));
  }

  async getListDistrict(provinceCode: string) {
    const results = await this.prisma.district.findMany({
      where: { provinceCode },
    });
    return results.map((item) => ({
      id: item.code,
      title: item.name,
    }));
  }

  async getListWard(districtCode: string) {
    const results = await this.prisma.ward.findMany({
      where: { districtCode },
    });
    return results.map((item) => ({
      id: item.code,
      title: item.name,
    }));
  }

  async getListFacilityType() {
    const results = await this.prisma.facilityType.findMany();
    return results.map((item) => ({
      id: item.id,
      title: item.name,
    }));
  }
}
