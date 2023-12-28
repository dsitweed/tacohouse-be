import { VoteType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  targetId: number;

  @IsNotEmpty()
  @IsEnum(VoteType)
  type: VoteType;

  @IsNotEmpty()
  @IsDecimal()
  star: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
