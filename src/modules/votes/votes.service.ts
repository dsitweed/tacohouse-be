import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'nestjs-prisma';
import { QueryFindAllVoteDto } from './dto';
import { VoteType } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createVoteDto: CreateVoteDto) {
    return this.prisma.vote.create({
      data: {
        voterId: userId,
        ...createVoteDto,
      },
    });
  }

  async findAll(query: QueryFindAllVoteDto) {
    const isValid = await this.checkVoteDtoValid(query.type, query.targetId);
    console.log({
      query,
    });

    if (!isValid) {
      throw new BadRequestException('TargetId not exits');
    }

    const { limit, offset, ...otherCondition } = query;
    return this.prisma.vote.findMany({
      where: {
        ...otherCondition,
      },
      include: {
        voter: {
          select: {
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        star: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.prisma.vote.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }

  /* HELPER METHOD */
  async checkVoteDtoValid(type: VoteType, targetId: number) {
    switch (type) {
      case VoteType.ROOM:
        const roomTarget = await this.prisma.room.findUnique({
          where: { id: targetId },
        });
        if (roomTarget) return true;
        break;
      case VoteType.USER:
        const userTarget = await this.prisma.user.findUnique({
          where: { id: targetId },
        });
        if (userTarget) return true;
        break;
      default:
        return false;
    }

    return false;
  }
}
