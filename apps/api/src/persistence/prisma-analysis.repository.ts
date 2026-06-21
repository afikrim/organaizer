import { Injectable } from '@nestjs/common';
import type { FollowUpTurn, Zone } from '@organaizer/schema';
import { AnalysisRepository, PersistedAnalysis, StoredAnalysis } from './analysis.repository';
import { PrismaService } from './prisma.service';

/**
 * Prisma-backed AnalysisRepository.
 *
 * Storage notes:
 * - Analysis.zones and Analysis.checklist are stored as JSON columns.
 * - Follow-up turns are stored as rows in the follow_up_turns table.
 * - findById reconstructs PersistedAnalysis with followUps sorted by createdAt ASC.
 * - appendFollowUp is session-scoped: verifies the analysis belongs to the given session.
 */
@Injectable()
export class PrismaAnalysisRepository implements AnalysisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(record: StoredAnalysis): Promise<void> {
    const { analysis, sessionId, imageKey } = record;
    await this.prisma.analysis.upsert({
      where: { id: analysis.id },
      create: {
        id: analysis.id,
        sessionId,
        imageKey,
        goal: analysis.goal,
        status: analysis.status,
        summary: analysis.summary,
        model: analysis.model ?? null,
        zones: analysis.zones as unknown as import('@prisma/client').Prisma.InputJsonValue,
        checklist: analysis.checklist as unknown as import('@prisma/client').Prisma.InputJsonValue,
        createdAt: new Date(analysis.createdAt),
      },
      update: {
        summary: analysis.summary,
        model: analysis.model ?? null,
        zones: analysis.zones as unknown as import('@prisma/client').Prisma.InputJsonValue,
        checklist: analysis.checklist as unknown as import('@prisma/client').Prisma.InputJsonValue,
      },
    });
  }

  async findById(id: string): Promise<StoredAnalysis | undefined> {
    const row = await this.prisma.analysis.findUnique({
      where: { id },
      include: {
        followUps: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!row) return undefined;
    return this.toStoredAnalysis(row);
  }

  async appendFollowUp(
    analysisId: string,
    sessionId: string,
    turn: FollowUpTurn,
  ): Promise<StoredAnalysis | undefined> {
    // Session-scoped: verify the analysis belongs to this session before mutating.
    const existing = await this.prisma.analysis.findUnique({ where: { id: analysisId } });
    if (!existing || existing.sessionId !== sessionId) return undefined;

    await this.prisma.followUpTurn.create({
      data: {
        id: turn.id,
        analysisId,
        question: turn.question,
        answer: turn.answer,
        safetyNote: turn.safetyNote ?? null,
        createdAt: new Date(turn.createdAt),
      },
    });

    return this.findById(analysisId);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private toStoredAnalysis(
    row: import('@prisma/client').Analysis & {
      followUps: import('@prisma/client').FollowUpTurn[];
    },
  ): StoredAnalysis {
    const followUps: FollowUpTurn[] = row.followUps.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      safetyNote: f.safetyNote ?? null,
      createdAt: f.createdAt.toISOString(),
    }));

    const analysis: PersistedAnalysis = {
      id: row.id,
      goal: row.goal as PersistedAnalysis['goal'],
      status: row.status as PersistedAnalysis['status'],
      summary: row.summary,
      model: row.model ?? undefined,
      zones: row.zones as unknown as Zone[],
      checklist: row.checklist as unknown as string[],
      createdAt: row.createdAt.toISOString(),
      followUps,
    };

    return { sessionId: row.sessionId, imageKey: row.imageKey, analysis };
  }
}
