import { PrismaClient } from '@prisma/client';
import dbhcvn from '../../../data/dvhcvn.json';

const prisma = new PrismaClient();

export async function seedLocation() {
  const provinces: any[] = [];
  const districts: any[] = [];
  const wards: any[] = [];

  dbhcvn.data.forEach((province) => {
    provinces.push({ code: province.level1_id, name: province.name });

    province.level2s.forEach((district) => {
      districts.push({
        code: district.level2_id,
        name: district.name,
        provinceCode: province.level1_id,
      });

      district.level3s.forEach((ward) => {
        wards.push({
          code: ward.level3_id,
          name: ward.name,
          provinceCode: province.level1_id,
          districtCode: district.level2_id,
        });
      });
    });
  });

  await prisma.province.createMany({ data: provinces });
  await prisma.district.createMany({ data: districts });
  await prisma.ward.createMany({ data: wards });
}
