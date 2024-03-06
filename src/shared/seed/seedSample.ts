import { PrismaClient, UserRole } from '@prisma/client';
import * as argon from 'argon2';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedSample() {
  // Create admins
  for (let i = 0; i < 3; i++) {
    const email = `admin${i !== 0 ? i : ''}@gmail.com`;
    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon.hash('123456'),
        role: UserRole.ADMIN,
      },
    });
  }

  // Create managers
  for (let i = 0; i < 5; i++) {
    const email = `manager${i !== 0 ? i : ''}@gmail.com`;
    const newManager = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon.hash('123456'),
        role: UserRole.MANAGER,
        firstName: 'Tenant',
        lastName: 'Nguyễn',
        address: 'Hà Nội, Việt Nam',
        citizenNumber: '012345678911',
        phoneNumber: '0123456789',
        avatarUrl:
          'https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=900&t=st=1695911553~exp=1695912153~hmac=9df92a16c66500f5f93a0ee6e39528de4a04dcd2ede3d505d4fc0bac1a7cfe16',
        dob: '1997-07-16T19:20:30.451Z',
      },
    });

    // Create building for each manager
    await createBuilding(newManager.id);
  }

  // Create tenants
  for (let i = 0; i < 50; i++) {
    const email = `tenant${i !== 0 ? i : ''}@gmail.com`;
    await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        password: await argon.hash('123456'),
        role: UserRole.TENANT,
        firstName: 'Tenant',
        lastName: 'Nguyễn',
        address: 'Hà Nội, Việt Nam',
        citizenNumber: '012345678911',
        phoneNumber: '0123456789',
        avatarUrl:
          'https://media.femalemag.com.sg/public/2019/03/51021013_237686723851021_5419594866899599564_n-cc-768x960.jpg?compress=true&quality=80&w=480&dpr=2.6',
        dob: '1997-07-16T19:20:30.451Z',
        roomId: getRandomInt(1, await prisma.room.count()),
      },
    });
  }

  // Create FacilityType
  await prisma.facilityType.createMany({
    data: [
      { name: 'air conditioner' },
      { name: 'washing machine' },
      { name: 'water heater' },
    ],
  });

  // Create Facility
  for (let i = 0; i < (await prisma.room.count()) / 2; i++) {
    await prisma.facility.create({
      data: {
        name: `facility ${i}`,
        price: getRandomInt(100000, 300000, 100000),
        buyPrice: getRandomInt(1000000, 3000000, 100000),
        brand: 'Viet Nam',
        facilityTypeId: getRandomInt(1, await prisma.facilityType.count()),
        roomId: getRandomInt(1, await prisma.room.count()),
      },
    });
  }

  // Create InvoiceType
  await prisma.invoiceType.createMany({
    data: [
      { name: 'rental' },
      { name: 'maintain' },
      { name: 'facility' },
      { name: 'deposit for room' },
    ],
  });

  // Create invoice
  for (let i = 0; i < 50; i++) {
    const room = await prisma.room.findUnique({
      where: { id: getRandomInt(1, await prisma.room.count()) },
      include: { tenants: true },
    });

    if (room.tenants.length === 0) continue;

    await prisma.invoice.create({
      data: {
        total: getRandomInt(1000000, 3500000, 100000),
        tenantIds: room.tenants.map((item) => item.id),
        roomId: room.id,
        invoiceTypeId: getRandomInt(1, await prisma.invoiceType.count()),
        buildingId: room.buildingId,
      },
    });
  }

  /* END SEEDING */
  prisma.$disconnect();
}

async function createBuilding(managerId: number) {
  // Create new building
  for (let i = 0; i < getRandomInt(1, 3); i++) {
    const newBuilding = await prisma.building.create({
      // have bug with unique(ownerId and name of building)
      data: {
        name: faker.company.name(),
        address: `${faker.location.city()}, ${faker.location.country()}`,
        ownerId: managerId,
        type: 'HOSTEL',
        ward: 'Láng Thượng',
        district: 'Đống Đa',
        province: 'Hà Nội',
      },
    });

    // Create building unit prices for each building
    await prisma.buildingUnitPrice.createMany({
      data: [
        { name: 'electricity', price: 3000, buildingId: newBuilding.id },
        { name: 'water', price: 40000, buildingId: newBuilding.id },
        { name: 'wifi', price: 30000, buildingId: newBuilding.id },
        { name: 'light', price: 20000, buildingId: newBuilding.id },
        { name: 'environment', price: 30000, buildingId: newBuilding.id },
      ],
    });

    // Create rooms for each building
    for (let i = 0; i < getRandomInt(3, 8); i++) {
      const newRoom = await prisma.room.create({
        data: {
          name: `room ${i}`,
          maxTenant: getRandomInt(1, 5),
          price: getRandomInt(800000, 3000000, 100000),
          area: getRandomInt(18, 28),
          buildingId: newBuilding.id,
          imageUrls: [
            'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          ],
          deposit: 1000000,
          debt: getRandomInt(0, 1000, 1000),
          description: faker.lorem.paragraphs({ min: 3, max: 6 }),
        },
      });

      // Create room unit prices for each room
      const buildingUnitPrices = await prisma.buildingUnitPrice.findMany({
        where: {
          buildingId: newBuilding.id,
        },
      });

      for (let i = 0; i < buildingUnitPrices.length; i++) {
        await prisma.roomUnitPrice.create({
          data: {
            roomId: newRoom.id,
            buildingUnitPriceId: buildingUnitPrices[i].id,
            before: getRandomInt(100, 150),
            current: getRandomInt(151, 200),
          },
        });
      }
      /* End create room unit prices for each room */
    }
  }
}

/**
 * Helper function for seed data. The min and max are multiples of step
 * @param min inclusive, multiples of step
 * @param max inclusive, multiples of step
 * @param step 1 is default
 * @returns value in [min, max]
 */
function getRandomInt(min: number, max: number, step = 1) {
  return Math.floor((Math.random() * (max - min + step) + min) / step) * step;
}
