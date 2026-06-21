import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { SessionService } from './sessions/session.service';
import { SessionsModule } from './sessions/sessions.module';
import { MockVisionProvider } from './vision/mock-vision.provider';
import { AnalysesService } from './analyses/analyses.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  it('returns status ok', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(typeof result.uptime).toBe('number');
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
    const analysis = analysesService.createAnalysis(
      session.sessionId,
      'cleaner',
      'room.jpg',
    );

    expect(analysis.id).toBeTruthy();
    expect(analysis.goal).toBe('cleaner');
    expect(analysis.status).toBe('complete');
    expect(analysis.zones.length).toBeGreaterThan(0);
    expect(analysis.checklist.length).toBeGreaterThanOrEqual(3);
    expect(analysis.checklist.length).toBeLessThanOrEqual(6);
    expect(analysis.followUps).toHaveLength(0);

    const fetched = analysesService.getAnalysis(analysis.id, session.sessionId);
    expect(fetched.id).toBe(analysis.id);
  });

  it('throws not found for wrong session', () => {
    const s1 = sessionService.createSession();
    const s2 = sessionService.createSession();
    const analysis = analysesService.createAnalysis(s1.sessionId, 'safer', 'img.png');

    expect(() => analysesService.getAnalysis(analysis.id, s2.sessionId)).toThrow();
  });

  it('adds a follow-up answer', () => {
    const session = sessionService.createSession();
    const analysis = analysesService.createAnalysis(session.sessionId, 'work', 'desk.jpg');

    const answer = analysesService.addFollowUp(
      analysis.id,
      session.sessionId,
      'How long will it take?',
    );

    expect(answer.analysisId).toBe(analysis.id);
    expect(answer.answer).toBeTruthy();
    expect(answer.question).toBe('How long will it take?');
  });
});
