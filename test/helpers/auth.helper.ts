import { INestApplication } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthService } from '../../src/modules/auth/auth.service';
import { fakeUser } from '../mocks';

export type AuthHeader = Record<'Authorization', string>;

export class AuthHelper {
  private app: INestApplication;
  private prisma: PrismaClient;
  private authService: AuthService;
  constructor() {
    this.app = global.testContext.app;
    this.prisma = global.testContext.prisma;
    this.authService = this.app.select(AuthModule).get(AuthService);
  }

  async createUser(override: Partial<User> = {}) {
    return this.prisma.user.create({
      data: await fakeUser(override),
    });
  }

  async createUserWithToken(override: Partial<User> = {}) {
    const user = await this.createUser(override);

    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = this.authService.signTokens(jwtPayload);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user,
      tokens,
    };
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUsers(ids: number[]) {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
  }

  async clearUsers() {
    await this.prisma.user.deleteMany();
  }

  async fakeAuthHeader(overrideUser: Partial<User> = {}): Promise<AuthHeader> {
    const {
      tokens: { accessToken },
    } = await this.createUserWithToken(overrideUser);

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
}
