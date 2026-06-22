import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Analysis, Goal, Zone, FollowUpAnswer } from '@organaizer/schema';
import { VisionProvider } from './vision.provider';

/**
 * Deterministic mock vision provider.
 * Returns plausible Analysis-compatible data using only file metadata.
 * No real AI calls are made.
 */
@Injectable()
export class MockVisionProvider extends VisionProvider {
  private readonly MODEL_NAME = 'mock-vision-v1';

  override async createAnalysis(
    analysisId: string,
    goal: Goal,
    imageUrl: string,
    _image: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<Omit<Analysis, 'followUps'>> {
    const zones = this.buildZones(goal);
    const checklist = this.buildChecklist(goal);
    const summary = this.buildSummary(goal, zones.length);

    return {
      id: analysisId,
      goal,
      status: 'complete',
      summary,
      imageUrl,
      model: this.MODEL_NAME,
      zones,
      checklist,
      createdAt: new Date().toISOString(),
    };
  }

  override async createFollowUpAnswer(
    analysisId: string,
    question: string,
    goal: Goal,
    _priorContext?: { summary: string; zones: { label: string; issue: string; suggestion: string }[] },
  ): Promise<Omit<FollowUpAnswer, 'id' | 'createdAt'>> {
    const answer = this.buildFollowUpAnswer(question, goal);
    return {
      analysisId,
      question,
      answer,
      safetyNote: null,
    };
  }

  private buildZones(goal: Goal): Zone[] {
    const zoneTemplates: Record<Goal, Zone[]> = {
      cleaner: [
        {
          id: randomUUID(),
          number: 1,
          label: 'Floor area',
          type: 'clutter',
          priority: 'high',
          box: { x: 10, y: 60, width: 80, height: 30 },
          issue: 'Items scattered across floor creating clutter.',
          suggestion: 'Group items by category and store in labeled bins.',
        },
        {
          id: randomUUID(),
          number: 2,
          label: 'Surface area',
          type: 'clutter',
          priority: 'medium',
          box: { x: 5, y: 20, width: 90, height: 35 },
          issue: 'Surface covered with miscellaneous items.',
          suggestion: 'Clear surface and only keep daily-use items visible.',
        },
        {
          id: randomUUID(),
          number: 3,
          label: 'Corner storage',
          type: 'storage_opportunity',
          priority: 'low',
          box: { x: 80, y: 40, width: 20, height: 50 },
          issue: 'Corner space underutilized.',
          suggestion: 'Add a corner shelf or storage unit.',
        },
      ],
      safer: [
        {
          id: randomUUID(),
          number: 1,
          label: 'Walkway',
          type: 'unsafe_placement',
          priority: 'high',
          box: { x: 20, y: 70, width: 60, height: 25 },
          issue: 'Items blocking main walkway creating a trip hazard.',
          suggestion: 'Clear walkway completely; relocate items to shelving.',
        },
        {
          id: randomUUID(),
          number: 2,
          label: 'Electrical area',
          type: 'cable_mess',
          priority: 'high',
          box: { x: 60, y: 30, width: 35, height: 40 },
          issue: 'Cables tangled and exposed near power sources.',
          suggestion: 'Use cable management clips and a power strip with surge protection.',
        },
        {
          id: randomUUID(),
          number: 3,
          label: 'Shelf stability',
          type: 'unsafe_placement',
          priority: 'medium',
          box: { x: 0, y: 10, width: 40, height: 60 },
          issue: 'Heavy items placed on upper shelves.',
          suggestion: 'Move heavy items to lower shelves or the floor.',
        },
      ],
      storage: [
        {
          id: randomUUID(),
          number: 1,
          label: 'Vertical space',
          type: 'storage_opportunity',
          priority: 'high',
          box: { x: 0, y: 0, width: 30, height: 100 },
          issue: 'Vertical wall space not utilized for storage.',
          suggestion: 'Install wall-mounted shelving to maximize vertical storage.',
        },
        {
          id: randomUUID(),
          number: 2,
          label: 'Under-bed / under-surface',
          type: 'wasted_space',
          priority: 'medium',
          box: { x: 10, y: 50, width: 80, height: 45 },
          issue: 'Space under surfaces is empty and unused.',
          suggestion: 'Add rolling storage drawers or shallow bins.',
        },
        {
          id: randomUUID(),
          number: 3,
          label: 'Door back',
          type: 'storage_opportunity',
          priority: 'low',
          box: { x: 85, y: 0, width: 15, height: 80 },
          issue: 'Back of door has no storage attached.',
          suggestion: 'Mount an over-door organizer for small items.',
        },
      ],
      work: [
        {
          id: randomUUID(),
          number: 1,
          label: 'Desk cable management',
          type: 'cable_mess',
          priority: 'high',
          box: { x: 20, y: 30, width: 60, height: 50 },
          issue: 'Multiple cables visible on and around desk surface.',
          suggestion: 'Use a cable management box and adhesive clips under the desk.',
        },
        {
          id: randomUUID(),
          number: 2,
          label: 'Monitor height',
          type: 'poor_accessibility',
          priority: 'medium',
          box: { x: 25, y: 5, width: 50, height: 40 },
          issue: 'Monitor positioned below eye level.',
          suggestion: 'Raise monitor using a stand or arm to eye-level ergonomic position.',
        },
        {
          id: randomUUID(),
          number: 3,
          label: 'Document storage',
          type: 'clutter',
          priority: 'medium',
          box: { x: 70, y: 20, width: 30, height: 60 },
          issue: 'Papers and documents piled on desk.',
          suggestion: 'Use a vertical file organizer or inbox/outbox trays.',
        },
      ],
      aesthetics: [
        {
          id: randomUUID(),
          number: 1,
          label: 'Visual clutter',
          type: 'aesthetic_improvement',
          priority: 'high',
          box: { x: 0, y: 0, width: 100, height: 100 },
          issue: 'Too many items visible creating visual noise.',
          suggestion: 'Reduce visible items by 50% and use matching containers.',
        },
        {
          id: randomUUID(),
          number: 2,
          label: 'Color harmony',
          type: 'aesthetic_improvement',
          priority: 'medium',
          box: { x: 10, y: 10, width: 80, height: 80 },
          issue: 'Mismatched colors and textures reduce visual coherence.',
          suggestion: 'Choose 2–3 accent colors and stick to them for containers and accessories.',
        },
        {
          id: randomUUID(),
          number: 3,
          label: 'Lighting',
          type: 'aesthetic_improvement',
          priority: 'low',
          box: { x: 30, y: 0, width: 40, height: 30 },
          issue: 'Lighting appears harsh or unflattering.',
          suggestion: 'Add warm-toned secondary lighting to soften the space.',
        },
      ],
    };

    return zoneTemplates[goal];
  }

  private buildChecklist(goal: Goal): string[] {
    const checklists: Record<Goal, string[]> = {
      cleaner: [
        'Remove all items from surfaces and sort into keep, donate, discard piles',
        'Wipe down all surfaces before replacing items',
        'Store similar items together in labeled containers',
        'Establish a 5-minute daily tidy routine',
        'Place a small bin in each zone to catch loose items',
      ],
      safer: [
        'Clear all walkways of obstructions immediately',
        'Secure or cable-manage all electrical cords',
        'Move heavy items from upper to lower shelves',
        'Check that smoke detectors are unobstructed',
        'Ensure emergency exit paths are clear',
      ],
      storage: [
        'Measure available vertical and under-surface space',
        'Purchase wall brackets and shelving rated for intended load',
        'Install under-surface rolling drawers',
        'Label all storage containers clearly',
        'Create an inventory list of stored items',
        'Review and purge stored items every 6 months',
      ],
      work: [
        'Route and clip all cables below desk surface',
        'Raise monitor to eye-level using a stand or arm',
        'Clear desk to essential items only',
        'Set up a paper inbox/outbox system',
        'Ensure adequate task lighting above work surface',
      ],
      aesthetics: [
        'Choose a 2–3 color palette for the space',
        'Replace mismatched containers with uniform set',
        'Remove 50% of visible decorative items',
        'Add one focal point (plant, artwork, or lamp)',
        'Conceal cables and utilitarian items from view',
        'Steam or straighten any fabric in the space',
      ],
    };

    return checklists[goal];
  }

  private buildSummary(goal: Goal, zoneCount: number): string {
    const summaries: Record<Goal, string> = {
      cleaner: `The space has ${zoneCount} zones with clutter and organizational opportunities. Focused clearing and categorization will significantly improve the cleanliness.`,
      safer: `${zoneCount} safety concerns were identified. Addressing the walkway hazards and cable management should be the immediate priority.`,
      storage: `${zoneCount} storage improvement opportunities found. Utilizing vertical space and under-surface areas could dramatically increase usable storage.`,
      work: `${zoneCount} workspace optimization opportunities identified. Ergonomic improvements and cable management will boost productivity and comfort.`,
      aesthetics: `${zoneCount} areas for aesthetic improvement identified. A cohesive color palette and reduced visual clutter will transform the space.`,
    };

    return summaries[goal];
  }

  private buildFollowUpAnswer(question: string, goal: Goal): string {
    const lq = question.toLowerCase();

    if (lq.includes('cost') || lq.includes('price') || lq.includes('budget')) {
      return `Most improvements for a ${goal} goal can be achieved for under $50. Focus on using what you have first — repositioning and decluttering cost nothing. Storage solutions from budget retailers typically run $5–30 per item.`;
    }

    if (lq.includes('how long') || lq.includes('time') || lq.includes('weekend')) {
      return `The changes recommended for the ${goal} goal can typically be completed in a 2–4 hour session. Tackle the high-priority zones first; lower priority items can wait for a follow-up session.`;
    }

    if (lq.includes('where') || lq.includes('buy') || lq.includes('purchase') || lq.includes('shop')) {
      return `For ${goal} improvements, consider IKEA, The Container Store, or Amazon for storage solutions. Thrift stores often have baskets and organizers at a fraction of retail price.`;
    }

    if (lq.includes('safe') || lq.includes('hazard') || lq.includes('danger')) {
      return `Safety is always the first priority regardless of your main goal. Address any trip hazards, unstable shelving, or cable issues before focusing on ${goal} improvements.`;
    }

    return `Great question about your ${goal} project. The key is to approach it systematically: start with the highest-priority zone, complete it fully, then move to the next. Small consistent changes compound into a significantly improved space. Would you like specific product recommendations or step-by-step instructions for any zone?`;
  }
}
