import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Analysis, FollowUpAnswer, FollowUpTurn, Goal } from '@organaizer/schema';
import { MockVisionProvider } from '../vision/mock-vision.provider';
import { errorEnvelope } from '../common/error.envelope';
import { AnalysisRepository } from '../persistence/analysis.repository';
import { ImageStorage, type StoredImage } from '../persistence/image.storage';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly vision: MockVisionProvider,
    private readonly analyses: AnalysisRepository,
    private readonly images: ImageStorage,
  ) {}

  createAnalysis(
    sessionId: string,
    goal: Goal,
    imageUrl: string,
    analysisId: string,
    image: StoredImage,
  ): Analysis {
    const base = this.vision.createAnalysis(analysisId, goal, imageUrl);
    const imageKey = this.buildImageKey(sessionId, analysisId);

    const analysis: Analysis = {
      ...base,
      followUps: [],
    };

    this.images.save(imageKey, image);
    this.analyses.save({ sessionId, imageKey, analysis });

    return analysis;
  }

  getAnalysis(id: string, sessionId: string): Analysis {
    const record = this.analyses.findById(id);

    if (!record || record.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${id} not found.`),
      );
    }

    return record.analysis;
  }

  getImageBuffer(
    sessionId: string,
    analysisId: string,
  ): { buffer: Buffer; mimetype: string; originalname: string } | undefined {
    const record = this.analyses.findById(analysisId);
    if (!record || record.sessionId !== sessionId) {
      return undefined;
    }

    return this.images.get(record.imageKey);
  }

  addFollowUp(
    analysisId: string,
    sessionId: string,
    question: string,
  ): FollowUpAnswer {
    const record = this.analyses.findById(analysisId);

    if (!record || record.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${analysisId} not found.`),
      );
    }

    const answerId = randomUUID();
    const createdAt = new Date().toISOString();

    const partial = this.vision.createFollowUpAnswer(
      analysisId,
      question,
      record.analysis.goal,
    );

    const turn: FollowUpTurn = {
      id: answerId,
      question,
      answer: partial.answer,
      safetyNote: partial.safetyNote ?? null,
      createdAt,
    };

    this.analyses.appendFollowUp(analysisId, turn);

    const response: FollowUpAnswer = {
      id: answerId,
      analysisId,
      question,
      answer: partial.answer,
      safetyNote: partial.safetyNote ?? null,
      createdAt,
    };

    return response;
  }

  private buildImageKey(sessionId: string, analysisId: string): string {
    return `${sessionId}/${analysisId}`;
  }
}
