import { Expose } from 'class-transformer';

export class PaginationDto<T = any> {
  @Expose()
  count: number;

  @Expose()
  items: T[];

  @Expose()
  message?: string;
}
