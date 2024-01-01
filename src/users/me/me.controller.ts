import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { UpdateUserDtoPartial } from '../dto';
import { MeService } from './me.service';

/**
 * This model for user manipulate individuals' profiles
 */
@ApiTags('Me')
@UseGuards(JwtGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getProfile(@GetUser() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...response } = user;
    return response;
  }

  @UseGuards(JwtGuard)
  @Patch()
  updateProfile(
    @GetUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDtoPartial,
  ) {
    return this.meService.update(userId, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  remove(@GetUser('id') userId: number) {
    return this.meService.remove(userId);
  }
}
