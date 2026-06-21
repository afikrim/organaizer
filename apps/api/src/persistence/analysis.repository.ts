import { Injectable } from '@nestjs/common';
import type { Analysis, FollowUpTurn } from '@organaizer/schema';

export interface StoredAnalysis {
  sessionId: string;
  imageKey: string;
  analysis: Analysis;
}

export abstract class AnalysisRepository {
  abstract save(record: StoredAnalysis): void;
  abstract findById(id: string): StoredAnalysis | undefined;
  abstract appendFollowUp(analysisId: string, turn: FollowUpTurn): StoredAnalysis | undefined;
}

@Injectable()
export class InMemoryAnalysisRepository implements AnalysisRepository {
  private readonly analyses = new Map<string, StoredAnalysis>();

  save(record: StoredAnalysis): void {
    this.analyses.set(record.analysis.id, record);
  }

  findById(id: string): StoredAnalysis | undefined {
    return this.analyses.get(id);
  }

  appendFollowUp(analysisId: string, turn: FollowUpTurn): StoredAnalysis | undefined {
    const record = this.analyses.get(analysisId);
    if (!record) return undefined;

    record.analysis.followUps.push(turn);
    return record;
  }
}
