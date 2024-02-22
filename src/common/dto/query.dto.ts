import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, Min } from 'class-validator';
import { number } from 'joi';

export class BaseQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageIndex: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 10;

  get skip(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }

  get take(): number {
    return this.pageSize;
  }
}

export class IdNumberParams {
  @IsNumberString()
  @Type(() => number)
  id!: number;
}
