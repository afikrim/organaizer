import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Analysis, FollowUpAnswer, FollowUpTurn, Goal } from '@organaizer/schema';
import { MockVisionProvider } from '../vision/mock-vision.provider';
import { errorEnvelope } from '../common/error.envelope';

interface StoredImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

interface StoredAnalysis extends Analysis {
  sessionId: string;
  image: StoredImage;
}

@Injectable()
export class AnalysesService {
  private readonly store = new Map<string, StoredAnalysis>();

  constructor(private readonly vision: MockVisionProvider) {}

  createAnalysis(
    sessionId: string,
    goal: Goal,
    imageUrl: string,
    analysisId: string,
    image: StoredImage,
  ): Analysis {
    const base = this.vision.createAnalysis(analysisId, goal, imageUrl);

    const analysis: StoredAnalysis = {
      ...base,
      followUps: [],
      sessionId,
      image,
    };

    this.store.set(analysisId, analysis);
    return this.toWire(analysis);
  }

  getAnalysis(id: string, sessionId: string): Analysis {
    const analysis = this.store.get(id);

    if (!analysis || analysis.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${id} not found.`),
      );
    }

    return this.toWire(analysis);
  }

  getImageBuffer(
    sessionId: string,
    analysisId: string,
  ): { buffer: Buffer; mimetype: string; originalname: string } | undefined {
    const analysis = this.store.get(analysisId);
    if (!analysis || analysis.sessionId !== sessionId) {
      return undefined;
    }
    return analysis.image;
  }

  addFollowUp(
    analysisId: string,
    sessionId: string,
    question: string,
  ): FollowUpAnswer {
    const analysis = this.store.get(analysisId);

    if (!analysis || analysis.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${analysisId} not found.`),
      );
    }

    const answerId = randomUUID();
    const createdAt = new Date().toISOString();

    const partial = this.vision.createFollowUpAnswer(analysisId, question, analysis.goal);

    const turn: FollowUpTurn = {
      id: answerId,
      question,
      answer: partial.answer,
      safetyNote: partial.safetyNote ?? null,
      createdAt,
    };

    analysis.followUps.push(turn);

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

  private toWire(analysis: StoredAnalysis): Analysis {
    const { sessionId: _sessionId, image: _image, ...rest } = analysis;
    void _sessionId;
    void _image;
    return rest;
  }
}
