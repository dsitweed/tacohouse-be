import { faker } from '@faker-js/faker';
import { Building } from '@prisma/client';
import { CreateBuildingDto } from 'src/modules/buildings/dto';

export const fakeCreateBuilding = (override: Partial<Building> = {}) => {
  return new CreateBuildingDto({
    name: faker.animal.bear(),
    address: faker.location.streetAddress(),
    type: 'HOSTEL',
    ward: faker.location.street(),
    district: faker.location.city(),
    province: faker.location.state(),
    ...override,
  });
};
