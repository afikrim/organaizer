import { Injectable } from '@nestjs/common';
import { SessionRecord, SessionRepository } from './session.repository';
import { PrismaService } from './prisma.service';

/**
 * Prisma-backed SessionRepository.
 * Persists tokenHash only — raw tokens are never stored.
 */
@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: SessionRecord): Promise<void> {
    await this.prisma.session.upsert({
      where: { tokenHash: session.tokenHash },
      create: {
        id: session.sessionId,
        tokenHash: session.tokenHash,
        createdAt: new Date(session.createdAt),
      },
      update: {},
    });
  }

  async findByTokenHash(tokenHash: string): Promise<SessionRecord | undefined> {
    const row = await this.prisma.session.findUnique({
      where: { tokenHash },
    });
    if (!row) return undefined;
    return {
      sessionId: row.id,
      tokenHash: row.tokenHash,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
