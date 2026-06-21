import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ErrorEnvelope } from '../common/error.envelope';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();

      // If we already shaped it as ErrorEnvelope, pass through
      if (
        typeof raw === 'object' &&
        raw !== null &&
        'code' in raw &&
        'message' in raw
      ) {
        response.status(status).json(raw);
        return;
      }

      // Multer file size errors come through as PayloadTooLargeException
      const envelope: ErrorEnvelope = {
        code: status === 413 ? 'image_too_large' : 'bad_request',
        message: typeof raw === 'string' ? raw : exception.message,
      };
      response.status(status).json(envelope);
      return;
    }

    // Unknown errors
    const envelope: ErrorEnvelope = {
      code: 'internal_error',
      message: 'An unexpected error occurred.',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(envelope);
  }
}
