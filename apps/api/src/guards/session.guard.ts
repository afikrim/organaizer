import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionService } from '../sessions/session.service';
import { errorEnvelope } from '../common/error.envelope';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        errorEnvelope('unauthorized', 'Missing or invalid session token.'),
      );
    }

    const token = authHeader.slice(7).trim();
    const session = this.sessionService.findByToken(token);

    if (!session) {
      throw new UnauthorizedException(
        errorEnvelope('unauthorized', 'Missing or invalid session token.'),
      );
    }

    // Attach session to request for use in handlers
    (request as Request & { session: typeof session }).session = session;

    return true;
  }
}
