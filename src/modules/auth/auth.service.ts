import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'nestjs-prisma';
import { JwtPayload } from 'src/common/interface';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}
  async signUp(dto: SignUpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new BadRequestException('This email is already taken');
    }
    const hashed = await argon.hash(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashed,
      },
      select: {
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    return newUser;
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = this.signTokens(jwtPayload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    delete user.password;

    return {
      ...tokens,
      jwtPayload,
      user,
    };
  }

  async signOut(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return 'Sign out success!';
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const checkMatches = await argon.verify(user.refreshToken, refreshToken);
    if (!checkMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = this.signTokens(jwtPayload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  /* Helper methods */

  /**
   * Update refresh_token in database
   * @param userId id of User instance
   * @param refreshToken refresh_token attribute of User instance
   */
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  signTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '100d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '100d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
