import { Injectable } from '@nestjs/common';
import type { Analysis, FollowUpTurn } from '@organaizer/schema';

export type PersistedAnalysis = Omit<Analysis, 'imageUrl'>;

export interface StoredAnalysis {
  sessionId: string;
  imageKey: string;
  analysis: PersistedAnalysis;
}

export abstract class AnalysisRepository {
  abstract save(record: StoredAnalysis): Promise<void>;
  abstract findById(id: string): Promise<StoredAnalysis | undefined>;
  abstract appendFollowUp(
    analysisId: string,
    sessionId: string,
    turn: FollowUpTurn,
  ): Promise<StoredAnalysis | undefined>;
}

@Injectable()
export class InMemoryAnalysisRepository implements AnalysisRepository {
  private readonly analyses = new Map<string, StoredAnalysis>();

  async save(record: StoredAnalysis): Promise<void> {
    this.analyses.set(record.analysis.id, record);
  }

  async findById(id: string): Promise<StoredAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async appendFollowUp(
    analysisId: string,
    sessionId: string,
    turn: FollowUpTurn,
  ): Promise<StoredAnalysis | undefined> {
    const record = this.analyses.get(analysisId);
    if (!record || record.sessionId !== sessionId) return undefined;

    record.analysis.followUps.push(turn);
    return record;
  }
}
