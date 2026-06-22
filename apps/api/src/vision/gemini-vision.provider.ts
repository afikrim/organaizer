import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GoogleGenAI, Type, ApiError } from '@google/genai';
import type { Analysis, Goal, Zone, FollowUpAnswer } from '@organaizer/schema';
import { PRIORITY_ORDER } from '@organaizer/schema';
import { VisionProvider } from './vision.provider';
import { errorEnvelope } from '../common/error.envelope';

/**
 * Gemini Flash vision provider.
 * Uses @google/genai SDK with structured JSON output (responseSchema).
 * Opt-in via VISION_DRIVER=gemini env var.
 */
@Injectable()
export class GeminiVisionProvider extends VisionProvider {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor() {
    super();
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is required when VISION_DRIVER=gemini. Set it in .env or environment.',
      );
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = process.env['GEMINI_MODEL'] ?? 'gemini-2.5-flash';
  }

  override async createAnalysis(
    analysisId: string,
    goal: Goal,
    imageUrl: string,
    image: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<Omit<Analysis, 'followUps'>> {
    const base64 = image.buffer.toString('base64');
    const prompt = this.buildAnalysisPrompt(goal);

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        zones: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              type: {
                type: Type.STRING,
                enum: [
                  'clutter',
                  'cable_mess',
                  'unsafe_placement',
                  'wasted_space',
                  'poor_accessibility',
                  'storage_opportunity',
                  'aesthetic_improvement',
                ],
              },
              priority: {
                type: Type.STRING,
                enum: ['high', 'medium', 'low'],
              },
              box: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                },
              },
              issue: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ['label', 'priority', 'box', 'issue', 'suggestion'],
          },
        },
        checklist: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['summary', 'zones', 'checklist'],
    };

    let raw: string;
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64, mimeType: image.mimetype } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: responseSchema,
        },
      });
      raw = response.text ?? '';
    } catch (err) {
      throw this.handleError(err, 'analysis');
    }

    if (!raw) {
      throw new InternalServerErrorException(
        errorEnvelope('ai_unavailable', 'Gemini returned an empty response.'),
      );
    }

    let parsed: GeminiAnalysisOutput;
    try {
      parsed = JSON.parse(raw) as GeminiAnalysisOutput;
    } catch {
      throw new InternalServerErrorException(
        errorEnvelope('ai_unavailable', 'Gemini returned invalid JSON.'),
      );
    }

    const zones = this.normalizeZones(parsed.zones ?? []);
    const checklist = this.normalizeChecklist(parsed.checklist ?? []);
    const summary = parsed.summary?.trim() || 'Analysis completed.';

    return {
      id: analysisId,
      goal,
      status: 'complete',
      summary,
      imageUrl,
      model: this.model,
      zones,
      checklist,
      createdAt: new Date().toISOString(),
    };
  }

  override async createFollowUpAnswer(
    analysisId: string,
    question: string,
    goal: Goal,
    priorContext?: {
      summary: string;
      zones: { label: string; issue: string; suggestion: string }[];
    },
  ): Promise<Omit<FollowUpAnswer, 'id' | 'createdAt'>> {
    const prompt = this.buildFollowUpPrompt(question, goal, priorContext);

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        answer: { type: Type.STRING },
        safetyNote: { type: Type.STRING },
      },
      required: ['answer'],
    };

    let raw: string;
    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: responseSchema,
        },
      });
      raw = response.text ?? '';
    } catch (err) {
      throw this.handleError(err, 'follow-up');
    }

    if (!raw) {
      throw new InternalServerErrorException(
        errorEnvelope('ai_unavailable', 'Gemini returned an empty response.'),
      );
    }

    let parsed: { answer?: string; safetyNote?: string };
    try {
      parsed = JSON.parse(raw) as { answer?: string; safetyNote?: string };
    } catch {
      throw new InternalServerErrorException(
        errorEnvelope('ai_unavailable', 'Gemini returned invalid JSON.'),
      );
    }

    return {
      analysisId,
      question,
      answer: parsed.answer?.trim() || 'Unable to generate an answer at this time.',
      safetyNote: parsed.safetyNote?.trim() || null,
    };
  }

  // -----------------------------------------------------------------------
  // Prompt builders
  // -----------------------------------------------------------------------

  private buildAnalysisPrompt(goal: Goal): string {
    const goalDescriptions: Record<Goal, string> = {
      cleaner: 'Make the space cleaner and less cluttered',
      safer: 'Make the space safer (trip hazards, cable management, stability)',
      storage: 'Maximize storage and organization',
      work: 'Optimize the space for work productivity and ergonomics',
      aesthetics: 'Improve the visual aesthetics of the space',
    };

    return `You are an expert space organizer. Analyze this image of a space.
Goal: ${goalDescriptions[goal]}

Identify 3-5 zones in the image that need attention for this goal. For each zone:
- Provide a short label (e.g. "Floor area", "Desk cables")
- Assign a priority: high, medium, or low
- Provide a bounding box as percentages of the image dimensions (x, y, width, height, each 0-100)
- Describe the issue concisely
- Suggest a specific, actionable fix

Also provide a 1-2 sentence summary of the overall analysis and a 3-6 item action checklist.

Return JSON matching the schema. Zone boxes are approximate; best-effort is fine.`;
  }

  private buildFollowUpPrompt(
    question: string,
    goal: Goal,
    priorContext?: {
      summary: string;
      zones: { label: string; issue: string; suggestion: string }[];
    },
  ): string {
    const contextStr = priorContext
      ? `Prior analysis summary: ${priorContext.summary}
Zones identified:
${priorContext.zones.map((z, i) => `${i + 1}. ${z.label}: ${z.issue} → ${z.suggestion}`).join('\n')}`
      : 'No prior context available.';

    return `You are an expert space organizer answering a follow-up question about a space analysis.
Goal: ${goal}
${contextStr}

User question: ${question}

Provide a helpful, specific answer. If there is a safety concern, include a safetyNote.
Return JSON matching the schema.`;
  }

  // -----------------------------------------------------------------------
  // Normalization
  // -----------------------------------------------------------------------

  private normalizeZones(raw: GeminiZone[]): Zone[] {
    const zones: Zone[] = raw.map((z, idx) => {
      const priority = this.clampPriority(z.priority);
      const box = this.normalizeBox(z.box);

      return {
        id: randomUUID(),
        number: idx + 1,
        label: z.label?.trim() || `Zone ${idx + 1}`,
        type: this.clampIssueType(z.type),
        priority,
        box,
        issue: z.issue?.trim() || 'Issue not specified.',
        suggestion: z.suggestion?.trim() || 'No suggestion available.',
      };
    });

    // Sort by descending priority.
    return [...zones].sort(
      (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
    );
  }

  private normalizeChecklist(raw: string[]): string[] {
    const items = raw
      .map((s) => s?.trim())
      .filter((s): s is string => Boolean(s));
    // Clamp to 3-6 items.
    if (items.length < 3) {
      while (items.length < 3) {
        items.push('Review and organize the identified zones.');
      }
    }
    return items.slice(0, 6);
  }

  private clampPriority(p?: string): 'high' | 'medium' | 'low' {
    if (p === 'high' || p === 'medium' || p === 'low') return p;
    return 'medium';
  }

  private clampIssueType(
    t?: string,
  ):
    | 'clutter'
    | 'cable_mess'
    | 'unsafe_placement'
    | 'wasted_space'
    | 'poor_accessibility'
    | 'storage_opportunity'
    | 'aesthetic_improvement'
    | undefined {
    const valid = [
      'clutter',
      'cable_mess',
      'unsafe_placement',
      'wasted_space',
      'poor_accessibility',
      'storage_opportunity',
      'aesthetic_improvement',
    ];
    if (t && valid.includes(t)) {
      return t as 'clutter' | 'cable_mess' | 'unsafe_placement' | 'wasted_space' | 'poor_accessibility' | 'storage_opportunity' | 'aesthetic_improvement';
    }
    return undefined;
  }

  private normalizeBox(
    box?: { x?: number; y?: number; width?: number; height?: number },
  ): { x: number; y: number; width: number; height: number } | null {
    if (!box) return null;
    const clamp = (n: unknown): number => {
      const num = typeof n === 'number' ? n : 0;
      return Math.max(0, Math.min(100, num));
    };
    const x = clamp(box.x);
    const y = clamp(box.y);
    const width = clamp(box.width);
    const height = clamp(box.height);
    if (width === 0 || height === 0) return null;
    return { x, y, width, height };
  }

  // -----------------------------------------------------------------------
  // Error handling
  // -----------------------------------------------------------------------

  private handleError(err: unknown, context: string): InternalServerErrorException {
    if (err instanceof ApiError) {
      const status = err.status;
      if (status === 429) {
        return new InternalServerErrorException(
          errorEnvelope('rate_limited', `Gemini rate limit exceeded during ${context}.`),
        );
      }
      if (status === 503 || status === 502 || status === 500) {
        return new InternalServerErrorException(
          errorEnvelope('ai_unavailable', `Gemini service unavailable during ${context}.`),
        );
      }
      return new InternalServerErrorException(
        errorEnvelope('ai_unavailable', `Gemini error during ${context}: ${err.message}`),
      );
    }
    return new InternalServerErrorException(
      errorEnvelope('ai_unavailable', `Unexpected error during ${context}.`),
    );
  }
}

// ---------------------------------------------------------------------------
// Gemini response types (pre-validation)
// ---------------------------------------------------------------------------

interface GeminiZone {
  label?: string;
  type?: string;
  priority?: string;
  box?: { x?: number; y?: number; width?: number; height?: number };
  issue?: string;
  suggestion?: string;
}

interface GeminiAnalysisOutput {
  summary?: string;
  zones?: GeminiZone[];
  checklist?: string[];
}