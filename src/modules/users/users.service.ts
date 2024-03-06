import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
        role: {
          not: UserRole.ADMIN,
        },
      },
      include: {
        room: {
          include: {
            building: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Not found user');
    }

    delete user.password;
    delete user.refreshToken;

    return user;
  }
}
