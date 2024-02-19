import { VoteType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { BaseQueryDto } from 'src/common/dto/query.dto';

export class QueryFindAllVoteDto extends BaseQueryDto {
  @IsNotEmpty()
  @IsEnum(VoteType)
  type: VoteType;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  targetId: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  voterId?: number;

  @IsOptional()
  @IsDecimal()
  @Type(() => Number)
  star?: number;
}
