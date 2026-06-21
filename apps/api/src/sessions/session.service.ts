import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { SessionRepository } from '../persistence/session.repository';

export interface Session {
  sessionId: string;
  token: string;
  createdAt: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly sessions: SessionRepository) {}

  createSession(): Session {
    const sessionId = randomUUID();
    const token = randomBytes(32).toString('hex');
    const createdAt = new Date().toISOString();
    const session: Session = { sessionId, token, createdAt };
    this.sessions.save(session);
    return session;
  }

  findByToken(token: string): Session | undefined {
    return this.sessions.findByToken(token);
  }
}
