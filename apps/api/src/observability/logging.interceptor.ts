import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Logs one line per request: "<METHOD> <url> <status> <ms>ms".
 * Both the success and error paths are logged; errors are re-thrown unchanged.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const { method, originalUrl } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(`${method} ${originalUrl} ${res.statusCode} ${ms}ms`);
      }),
      catchError((err: unknown) => {
        const ms = Date.now() - start;
        // The exception filter hasn't run yet, so res.statusCode is often still
        // 200 here. Trust HttpException.getStatus(); otherwise the unknown error
        // will become a 500 via AllExceptionsFilter.
        const status =
          typeof (err as { getStatus?: () => number })?.getStatus === 'function'
            ? (err as { getStatus: () => number }).getStatus()
            : 500;
        this.logger.error(`${method} ${originalUrl} ${status} ${ms}ms`);
        return throwError(() => err);
      }),
    );
  }
}
