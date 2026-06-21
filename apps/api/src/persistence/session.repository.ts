import { Injectable } from '@nestjs/common';

export interface SessionRecord {
  sessionId: string;
  tokenHash: string;
  createdAt: string;
}

export abstract class SessionRepository {
  abstract save(session: SessionRecord): Promise<void>;
  abstract findByTokenHash(tokenHash: string): Promise<SessionRecord | undefined>;
}

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, SessionRecord>();

  async save(session: SessionRecord): Promise<void> {
    this.sessions.set(session.tokenHash, session);
  }

  async findByTokenHash(tokenHash: string): Promise<SessionRecord | undefined> {
    return this.sessions.get(tokenHash);
  }
}
