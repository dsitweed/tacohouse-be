import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard';
import { GetUser } from 'src/common/decorator';
import { VoteDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Can get information of other user. But can not get information of ADMIN
   * @param id userId
   * @returns user: User
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * Just simple vote, not add tight rule
   */
  @UseGuards(JwtGuard)
  @Post('vote')
  vote(@GetUser('id') userId: number, @Body() dto: VoteDto) {
    return this.usersService.vote(userId, dto);
  }
}
