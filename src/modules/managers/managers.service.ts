import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTenantDto, GetListRoomQueryDto, UpdateTenantDto } from './dto';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';
import { UserRole } from '@prisma/client';
import { InvoicesService } from 'src/modules/invoices/invoices.service';

@Injectable()
export class ManagersService {
  constructor(
    private prisma: PrismaService,
    private invoicesService: InvoicesService,
  ) {}

  async findAllBuildings(userId: number) {
    return this.prisma.building.findMany({
      where: { ownerId: userId },
      include: {
        rooms: {
          include: {
            tenants: true,
          },
        },
      },
    });
  }

  async findAllTenants(userId: number) {
    return this.prisma.user.findMany({
      where: {
        // check permission: Manger/ Creator of this tenant can get info
        OR: [
          {
            room: {
              building: {
                ownerId: userId,
              },
            },
          },
          {
            creatorId: userId,
          },
        ],
      },
      include: {
        room: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneTenant(userId: number, tenantId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: tenantId,
        // check permission: Manger/ Creator of this tenant can get info
        OR: [
          { room: { building: { ownerId: userId } } },
          {
            creatorId: userId,
          },
        ],
      },
      include: {
        room: {
          include: {
            building: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async findAllRooms(userId: number, query: GetListRoomQueryDto) {
    const { buildingId, limit, offset } = query;

    const rawList = await this.prisma.room.findMany({
      where: {
        building: {
          ownerId: userId,
          id: buildingId,
        },
      },
      include: {
        tenants: true,
        building: true,
        // need optimize
        roomUnitPrices: {
          include: {
            buildingUnitPrice: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        name: 'asc',
      },
    });

    for (let index = 0; index < rawList.length; index++) {
      const room = rawList[index];
      const invoice = await this.invoicesService.getCurrentMonthRentalInvoice(
        room.id,
      );

      room['invoice'] = invoice;
    }

    return rawList;
  }

  async createTenant(userId: number, dto: CreateTenantDto) {
    // check roomId in dto is belong to current user
    const room = await this.prisma.room.findUnique({
      where: {
        id: dto.roomId,
        building: {
          ownerId: userId,
        },
      },
    });

    if (!room) {
      throw new ForbiddenException('Not have permission');
    }

    const tenants = await this.findAllTenants(userId);

    const email = `tenant${
      tenants.length + 1
    }-${userId}-${faker.internet.password({
      length: 5,
    })}@tenant.email`;

    /**
     * return new tenant with email, password, role = default
     */
    return this.prisma.user.create({
      data: {
        ...dto,
        email: email,
        password: await argon.hash('123456'),
        role: UserRole.TENANT,
        creatorId: userId,
      },
    });
  }

  async updateTenant(userId: number, tenantId: number, dto: UpdateTenantDto) {
    const updatedTenant = await this.prisma.user.update({
      where: {
        id: tenantId,
        OR: [
          {
            room: {
              building: {
                ownerId: userId,
              },
            },
          },
          {
            creatorId: userId,
          },
        ],
      },
      data: {
        ...dto,
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

    if (!updatedTenant) {
      throw new ForbiddenException('Not have permission');
    }

    return updatedTenant;
  }

  async deleteTenant(userId: number, tenantId: number) {
    // Check the tenant is under the management of the current user
    const deletedTenant = this.prisma.user.delete({
      where: {
        id: tenantId,
        role: UserRole.TENANT,
        room: {
          building: {
            ownerId: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!deletedTenant) {
      throw new ForbiddenException('Not have permission');
    }

    return deletedTenant;
  }
}
