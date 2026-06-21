import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { SessionService } from './sessions/session.service';
import { SessionsModule } from './sessions/sessions.module';
import { MockVisionProvider } from './vision/mock-vision.provider';
import { AnalysesService } from './analyses/analyses.service';

// Minimal stub image for unit tests – a 1×1 transparent PNG as a Buffer.
const STUB_IMAGE = {
  buffer: Buffer.from('stub'),
  mimetype: 'image/jpeg',
  originalname: 'room.jpg',
};

function makeImageUrl(sessionId: string, analysisId: string, filename: string): string {
  return `http://localhost:3000/v1/images/${sessionId}/${analysisId}/${encodeURIComponent(filename)}`;
}

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  it('returns status ok with numeric uptime', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(typeof result.uptime).toBe('number');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });
});

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SessionsModule],
    }).compile();
    service = module.get<SessionService>(SessionService);
  });

  it('creates a session with uuid and token', () => {
    const session = service.createSession();
    expect(session.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(session.token.length).toBeGreaterThan(10);
    expect(session.createdAt).toBeTruthy();
  });

  it('finds session by token', () => {
    const session = service.createSession();
    const found = service.findByToken(session.token);
    expect(found).toBeDefined();
    expect(found?.sessionId).toBe(session.sessionId);
  });

  it('returns undefined for unknown token', () => {
    const found = service.findByToken('nonexistent-token');
    expect(found).toBeUndefined();
  });
});

describe('AnalysesService', () => {
  let analysesService: AnalysesService;
  let sessionService: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService, MockVisionProvider, AnalysesService],
    }).compile();

    analysesService = module.get<AnalysesService>(AnalysesService);
    sessionService = module.get<SessionService>(SessionService);
  });

  it('creates an analysis and retrieves it', () => {
    const session = sessionService.createSession();
    const analysisId = randomUUID();
    const imageUrl = makeImageUrl(session.sessionId, analysisId, STUB_IMAGE.originalname);

    const analysis = analysesService.createAnalysis(
      session.sessionId,
      'cleaner',
      imageUrl,
      analysisId,
      STUB_IMAGE,
    );

    expect(analysis.id).toBe(analysisId);
    expect(analysis.goal).toBe('cleaner');
    expect(analysis.status).toBe('complete');
    expect(analysis.imageUrl).toBe(imageUrl);
    expect(analysis.zones.length).toBeGreaterThan(0);
    expect(analysis.checklist.length).toBeGreaterThanOrEqual(3);
    expect(analysis.checklist.length).toBeLessThanOrEqual(6);
    expect(analysis.followUps).toHaveLength(0);

    const fetched = analysesService.getAnalysis(analysis.id, session.sessionId);
    expect(fetched.id).toBe(analysis.id);
    expect(fetched.imageUrl).toBe(imageUrl);
  });

  it('imageUrl is a valid http URL', () => {
    const session = sessionService.createSession();
    const analysisId = randomUUID();
    const imageUrl = makeImageUrl(session.sessionId, analysisId, 'test.png');
    const analysis = analysesService.createAnalysis(
      session.sessionId,
      'storage',
      imageUrl,
      analysisId,
      { ...STUB_IMAGE, originalname: 'test.png', mimetype: 'image/png' },
    );
    expect(() => new URL(analysis.imageUrl)).not.toThrow();
    expect(analysis.imageUrl).toMatch(/^https?:\/\//);
  });

  it('throws not found for wrong session', () => {
    const s1 = sessionService.createSession();
    const s2 = sessionService.createSession();
    const aid = randomUUID();
    const analysis = analysesService.createAnalysis(
      s1.sessionId,
      'safer',
      makeImageUrl(s1.sessionId, aid, 'img.png'),
      aid,
      STUB_IMAGE,
    );

    expect(() => analysesService.getAnalysis(analysis.id, s2.sessionId)).toThrow();
  });

  it('adds a follow-up answer', () => {
    const session = sessionService.createSession();
    const aid = randomUUID();
    const analysis = analysesService.createAnalysis(
      session.sessionId,
      'work',
      makeImageUrl(session.sessionId, aid, 'desk.jpg'),
      aid,
      STUB_IMAGE,
    );

    const answer = analysesService.addFollowUp(
      analysis.id,
      session.sessionId,
      'How long will it take?',
    );

    expect(answer.analysisId).toBe(analysis.id);
    expect(answer.answer).toBeTruthy();
    expect(answer.question).toBe('How long will it take?');
  });

  it('getImageBuffer returns stored buffer for correct session', () => {
    const session = sessionService.createSession();
    const aid = randomUUID();
    analysesService.createAnalysis(
      session.sessionId,
      'aesthetics',
      makeImageUrl(session.sessionId, aid, 'room.jpg'),
      aid,
      STUB_IMAGE,
    );

    const stored = analysesService.getImageBuffer(session.sessionId, aid);
    expect(stored).toBeDefined();
    expect(stored?.mimetype).toBe('image/jpeg');
    expect(stored?.originalname).toBe('room.jpg');
  });

  it('getImageBuffer returns undefined for wrong session', () => {
    const s1 = sessionService.createSession();
    const s2 = sessionService.createSession();
    const aid = randomUUID();
    analysesService.createAnalysis(
      s1.sessionId,
      'cleaner',
      makeImageUrl(s1.sessionId, aid, 'room.jpg'),
      aid,
      STUB_IMAGE,
    );

    const stored = analysesService.getImageBuffer(s2.sessionId, aid);
    expect(stored).toBeUndefined();
  });
});
