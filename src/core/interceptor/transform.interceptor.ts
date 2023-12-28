import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export interface Response<T> {
  statusCode: number;
  message: string;
  count: number;
  data: T[];
}

@Injectable()
export class TransformInterceptor<T extends PaginationDto>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message,
        count: data.count,
        data: data.items ?? (data as never),
      })),
    );
  }
}
