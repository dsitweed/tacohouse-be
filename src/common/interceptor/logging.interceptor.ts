import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { writeFileSync } from 'fs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          writeFileSync(
            process.cwd() + '/logs/request.log',
            `${method},${url},${Date.now() - now}ms\n`,
            { flag: 'a+' },
          ),
        ),
      );
  }
}
