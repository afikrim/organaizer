import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';

export interface Session {
  sessionId: string;
  token: string;
  createdAt: string;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, Session>();

  createSession(): Session {
    const sessionId = randomUUID();
    const token = randomBytes(32).toString('hex');
    const createdAt = new Date().toISOString();
    const session: Session = { sessionId, token, createdAt };
    this.sessions.set(token, session);
    return session;
  }

  findByToken(token: string): Session | undefined {
    return this.sessions.get(token);
  }
}
