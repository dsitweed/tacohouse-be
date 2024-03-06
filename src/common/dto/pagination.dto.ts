import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginationDto<T = any> {
  @Expose()
  count: number;

  @Expose()
  items: T[];

  @Expose()
  message?: string;
}
