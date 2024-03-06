import { VoteType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsNumber()
  targetId: number;

  @IsNotEmpty()
  @IsEnum(VoteType)
  type: VoteType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  star: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
