import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

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

  get offset(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }

  get limit(): number {
    return this.pageSize;
  }
}
