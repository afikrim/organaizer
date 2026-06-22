import { Injectable } from '@nestjs/common';
import type { Analysis, Goal, FollowUpAnswer } from '@organaizer/schema';

/**
 * Abstract vision provider interface.
 * Wraps AI vision models so the concrete provider can be swapped
 * without touching controllers or services.
 */
@Injectable()
export abstract class VisionProvider {
  abstract createAnalysis(
    analysisId: string,
    goal: Goal,
    imageUrl: string,
    image: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<Omit<Analysis, 'followUps'>>;

  abstract createFollowUpAnswer(
    analysisId: string,
    question: string,
    goal: Goal,
    priorContext?: { summary: string; zones: { label: string; issue: string; suggestion: string }[] },
  ): Promise<Omit<FollowUpAnswer, 'id' | 'createdAt'>>;
}