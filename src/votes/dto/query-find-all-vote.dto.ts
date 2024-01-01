import { VoteType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Constant } from 'src/shared/constants';

export class QueryFindAllVoteDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) // If Client pass string -> convert to type number
  limit?: number = Constant.DEFAULT_LIMIT;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = Constant.DEFAULT_OFFSET;

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
