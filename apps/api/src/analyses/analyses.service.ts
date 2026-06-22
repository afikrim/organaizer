import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Analysis, FollowUpAnswer, FollowUpTurn, Goal } from '@organaizer/schema';
import { VisionProvider } from '../vision/vision.provider';
import { errorEnvelope } from '../common/error.envelope';
import { AnalysisRepository } from '../persistence/analysis.repository';
import { ImageStorage, type StoredImage } from '../persistence/image.storage';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly vision: VisionProvider,
    private readonly analyses: AnalysisRepository,
    private readonly images: ImageStorage,
  ) {}

  async createAnalysis(
    sessionId: string,
    goal: Goal,
    imageUrl: string,
    analysisId: string,
    image: StoredImage,
  ): Promise<Analysis> {
    const base = await this.vision.createAnalysis(analysisId, goal, imageUrl, image);
    const imageKey = this.buildImageKey(sessionId, analysisId);
    const { imageUrl: _imageUrl, ...persistedAnalysis } = base;
    void _imageUrl;

    const analysis = {
      ...persistedAnalysis,
      followUps: [],
    };

    await this.images.save(imageKey, image, imageUrl, sessionId);
    await this.analyses.save({ sessionId, imageKey, analysis });

    return { ...analysis, imageUrl };
  }

  async getAnalysis(
    id: string,
    sessionId: string,
    fallbackImageUrl?: string,
  ): Promise<Analysis> {
    const record = await this.analyses.findById(id);

    if (!record || record.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${id} not found.`),
      );
    }

    return this.toWire(record, fallbackImageUrl);
  }

  async getImageBuffer(
    sessionId: string,
    analysisId: string,
  ): Promise<{ buffer: Buffer; mimetype: string; originalname: string } | undefined> {
    const record = await this.analyses.findById(analysisId);
    if (!record || record.sessionId !== sessionId) {
      return undefined;
    }

    return this.images.get(record.imageKey);
  }

  async addFollowUp(
    analysisId: string,
    sessionId: string,
    question: string,
  ): Promise<FollowUpAnswer> {
    const record = await this.analyses.findById(analysisId);

    if (!record || record.sessionId !== sessionId) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${analysisId} not found.`),
      );
    }

    const answerId = randomUUID();
    const createdAt = new Date().toISOString();

    const priorContext = {
      summary: record.analysis.summary,
      zones: record.analysis.zones.map((z) => ({
        label: z.label,
        issue: z.issue,
        suggestion: z.suggestion,
      })),
    };

    const partial = await this.vision.createFollowUpAnswer(
      analysisId,
      question,
      record.analysis.goal,
      priorContext,
    );

    const turn: FollowUpTurn = {
      id: answerId,
      question,
      answer: partial.answer,
      safetyNote: partial.safetyNote ?? null,
      createdAt,
    };

    const updated = await this.analyses.appendFollowUp(analysisId, sessionId, turn);
    if (!updated) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Analysis ${analysisId} not found.`),
      );
    }

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

  private async toWire(record: {
    imageKey: string;
    analysis: Omit<Analysis, 'imageUrl'>;
  }, fallbackImageUrl?: string): Promise<Analysis> {
    const imageUrl = (await this.images.getUrl(record.imageKey)) ?? fallbackImageUrl;
    if (!imageUrl) {
      throw new NotFoundException(
        errorEnvelope('not_found', `Image for analysis ${record.analysis.id} not found.`),
      );
    }

    return { ...record.analysis, imageUrl };
  }
}