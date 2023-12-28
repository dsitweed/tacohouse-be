import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, VoteType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VoteDto } from './dto';

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

  async vote(userId: number, dto: VoteDto) {
    const isValid = this.checkVoteDtoValid(dto);
    if (!isValid) {
      throw new BadRequestException('Invalid');
    }

    return this.prisma.vote.create({
      data: {
        voterId: userId,
        ...dto,
      },
    });
  }

  /* HELPER METHOD */
  async checkVoteDtoValid(dto: VoteDto) {
    switch (dto.type) {
      case VoteType.ROOM:
        const roomTarget = await this.prisma.room.findUnique({
          where: { id: dto.targetId },
        });
        if (roomTarget) return true;
        break;
      case VoteType.USER:
        const userTarget = await this.prisma.user.findUnique({
          where: { id: dto.targetId },
        });
        // don't care user === userTarget
        if (userTarget) return true;
        break;
      default:
        return false;
    }

    return false;
  }
}
