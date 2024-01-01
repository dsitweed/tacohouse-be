import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDtoPartial } from '../dto';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async update(userId: number, updateUserDto: UpdateUserDtoPartial) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { ...updateUserDto },
      });

      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(`Have error: ${error.message}`);
    }
  }

  async remove(userId: number) {
    try {
      const deletedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { isActive: false, email: `${faker.string.uuid()}@.deleted.dev` },
      });

      delete deletedUser.password;
      return deletedUser;
    } catch (error) {
      throw new BadRequestException(`Have error: ${error.message}`);
    }
  }
}
