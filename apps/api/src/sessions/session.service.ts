import { Injectable } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { SessionRepository } from '../persistence/session.repository';

export interface Session {
  sessionId: string;
  token: string;
  createdAt: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly sessions: SessionRepository) {}

  async createSession(): Promise<Session> {
    const sessionId = randomUUID();
    const token = randomBytes(32).toString('hex');
    const createdAt = new Date().toISOString();
    const session: Session = { sessionId, token, createdAt };
    await this.sessions.save({
      sessionId,
      tokenHash: this.hashToken(token),
      createdAt,
    });
    return session;
  }

  async findByToken(token: string): Promise<Session | undefined> {
    const record = await this.sessions.findByTokenHash(this.hashToken(token));
    if (!record) return undefined;

    return { sessionId: record.sessionId, token, createdAt: record.createdAt };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
