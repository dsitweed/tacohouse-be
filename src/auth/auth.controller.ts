import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { JwtGuard } from 'src/common/guard';
import { GetUser } from 'src/common/decorator';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token.guard';
import { JwtPayload } from 'src/common/interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Post('sign-out')
  signOut(@GetUser('id') userId: number) {
    return this.authService.signOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@GetUser() user: JwtPayload & { refreshToken: string }) {
    return this.authService.refreshTokens(user.userId, user.refreshToken);
  }
}
