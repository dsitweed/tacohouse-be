import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtGuard } from 'src/common/guard';
import { GetUser } from 'src/common/decorator';
import { QueryFindAllVoteDto } from './dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser('id') userId: number, @Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(userId, createVoteDto);
  }

  @Get()
  findAll(@Query() query: QueryFindAllVoteDto) {
    return this.votesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(+id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
