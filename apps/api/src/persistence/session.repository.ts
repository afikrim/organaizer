import { Injectable } from '@nestjs/common';
import type { Session } from '../sessions/session.service';

export abstract class SessionRepository {
  abstract save(session: Session): void;
  abstract findByToken(token: string): Session | undefined;
}

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, Session>();

  save(session: Session): void {
    this.sessions.set(session.token, session);
  }

  findByToken(token: string): Session | undefined {
    return this.sessions.get(token);
  }
}
