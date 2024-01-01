import {
  Prisma,
  BuildingType,
  PrismaClient,
  UserRole,
  User,
} from '@prisma/client';
import * as argon from 'argon2';
import { RawRoomsI, chanhRooms } from './mungData/chanhBuilding';
import { faker } from '@faker-js/faker';
import { mungRooms } from './mungData/mungBuilding';

interface createBuildingI {
  name: string;
  address: string;
  ownerId: number;
  type: BuildingType;
  buildingUnitPrices: Prisma.BuildingUnitPriceCreateManyBuildingInput[];
  roomData?: RawRoomsI[];
}

const prisma = new PrismaClient();

export async function seedMungData() {
  // create Mung manager account
  const user = await prisma.user.upsert({
    where: {
      email: 'mung@gmail.com',
    },
    update: {},
    create: {
      email: 'mung@gmail.com',
      password: await argon.hash('123456'),
      role: UserRole.MANAGER,
    },
  });
  // Create building
  const buildings: createBuildingI[] = [
    {
      name: 'Nam',
      address: 'Tổ 2, gần chùa Giai Lạc',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [
        { name: 'electricity', price: 3000 },
        { name: 'water', price: 40000 },
        { name: 'wifi', price: 30000 },
        { name: 'light', price: 20000 },
        { name: 'environment', price: 30000 },
      ],
    },
    {
      name: 'Mung',
      address: 'Tổ 2, tòa nhà 5 tầng gần công ty Muto',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [
        { name: 'electricity', price: 3000 },
        { name: 'water', price: 40000 },
        { name: 'wifi', price: 30000 },
        { name: 'light', price: 20000 },
        { name: 'environment', price: 30000 },
      ],
      roomData: mungRooms,
    },
    {
      name: 'Chanh',
      address: 'Tổ 2, dãy nhà cấp 4',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [
        { name: 'electricity', price: 3000 },
        { name: 'water', price: 40000 },
        { name: 'environment', price: 10000 },
      ],
      roomData: chanhRooms,
    },
    {
      name: 'Cừa hàng nhà ngoài tổ 1',
      address: 'Tổ 1, gần bệnh viện giao thông vận tải cơ sở 2',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [],
    },
    {
      name: 'Nhà trọ Nam 2 phòng',
      address: 'Tổ 2, gần chợ chính Giai Lạc',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [],
    },
    {
      name: 'Nhà trọ Thùy 1 phòng',
      address: 'Tổ 1, gần trạm xá Quang Minh',
      ownerId: user.id,
      type: 'HOSTEL',
      buildingUnitPrices: [],
    },
  ];
  buildings.forEach(async (buildingData) => {
    await createBuilding(buildingData, user);
  });

  // END SEEDING
  prisma.$disconnect();
}

async function createBuilding(buildingData: createBuildingI, owner: User) {
  // Create building
  const newBuilding = await prisma.building.create({
    data: {
      name: buildingData.name,
      address: buildingData.address,
      ownerId: buildingData.ownerId,
      type: buildingData.type,
      // Create building unit prices for each building
      buildingUnitPrices: {
        createMany: {
          data: buildingData.buildingUnitPrices,
        },
      },
    },
    select: {
      buildingUnitPrices: true,
      id: true,
    },
  });

  // Create rooms
  buildingData.roomData?.forEach(async (room) => {
    const newRoom = await prisma.room.create({
      data: {
        name: String(room.name),
        price: room.price,
        area: room.area,
        buildingId: newBuilding.id,
      },
    });

    // Create room unit
    newBuilding.buildingUnitPrices.forEach(async (unit) => {
      await prisma.roomUnitPrice.create({
        data: {
          roomId: newRoom.id,
          buildingUnitPriceId: unit.id,
          before: 0,
          current: 0,
        },
      });
    });

    // Create tenant for room
    room.tenants.forEach(async (tenant: any) => {
      const email = `tenant-mung--${faker.internet.password({
        length: 5,
      })}@tenant.email`;
      await prisma.user.create({
        data: {
          email: email,
          password: await argon.hash('123456'),
          role: UserRole.TENANT,
          creatorId: owner.id,
          lastName: tenant.name,
          roomId: newRoom.id,
        },
      });
    });
  });
}
