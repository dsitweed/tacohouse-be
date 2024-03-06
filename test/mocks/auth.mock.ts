import { faker } from '@faker-js/faker';
import { Prisma, User } from '@prisma/client';
import { hash } from 'argon2';

export const fakeUser = async (
  override: Partial<User> = {},
): Promise<Prisma.UserCreateInput> => ({
  role: 'ADMIN',
  email: faker.internet.email(),
  ...override,
  password: await hash(override.password || '123456'),
});
