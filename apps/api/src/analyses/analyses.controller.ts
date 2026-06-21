import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { Analysis, FollowUpAnswer, Goal } from '@organaizer/schema';
import { GoalSchema, FollowUpRequestSchema } from '@organaizer/schema';
import { SessionGuard } from '../guards/session.guard';
import type { Session } from '../sessions/session.service';
import { AnalysesService } from './analyses.service';
import { errorEnvelope } from '../common/error.envelope';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const MAX_FILE_SIZE_BYTES =
  parseInt(process.env['MAX_FILE_SIZE_MB'] ?? '8', 10) * 1024 * 1024;

type AuthedRequest = Request & { session: Session };

/** Build a fully-qualified image URL from the incoming request. */
function buildImageUrl(
  req: Request,
  sessionId: string,
  analysisId: string,
  filename: string,
): string {
  // Prefer X-Forwarded-Proto / X-Forwarded-Host for reverse-proxy deployments;
  // fall back to the direct connection values.
  const proto =
    (req.headers['x-forwarded-proto'] as string | undefined) ??
    (req.secure ? 'https' : 'http');
  const host =
    (req.headers['x-forwarded-host'] as string | undefined) ?? req.headers.host ?? 'localhost';

  // NestJS sets the global prefix at the application level (not via Express
  // sub-router mounting), so req.baseUrl is always ''.  Instead, derive the
  // prefix from req.originalUrl: strip the trailing "/analyses[/...]" segment.
  // e.g. "/v1/analyses" → "/v1"
  const prefix = req.originalUrl.replace(/\/analyses(\/.*)?(\?.*)?$/, '');

  return `${proto}://${host}${prefix}/images/${sessionId}/${analysisId}/${encodeURIComponent(filename)}`;
}

function buildFallbackImageUrl(
  req: Request,
  sessionId: string,
  analysisId: string,
): string {
  return buildImageUrl(req, sessionId, analysisId, 'image');
}

@Controller('analyses')
@UseGuards(SessionGuard)
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              errorEnvelope(
                'invalid_file',
                `File type ${file.mimetype} is not accepted. Allowed: jpeg, png, webp, heic.`,
              ),
            ),
            false,
          );
        }
      },
    }),
  )
  createAnalysis(
    @Req() req: AuthedRequest,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('goal') rawGoal: string | undefined,
  ): Promise<Analysis> {
    if (!file) {
      throw new BadRequestException(
        errorEnvelope('invalid_file', 'An image file is required.'),
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        errorEnvelope(
          'image_too_large',
          `Image exceeds the maximum allowed size of ${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB.`,
        ),
      );
    }

    const goalResult = GoalSchema.safeParse(rawGoal);
    if (!goalResult.success) {
      throw new BadRequestException(
        errorEnvelope(
          'invalid_goal',
          `Invalid goal. Must be one of: cleaner, safer, storage, work, aesthetics.`,
          { received: rawGoal },
        ),
      );
    }

    const goal: Goal = goalResult.data;
    const { sessionId } = req.session;

    // Compute the image URL from this request so it reflects the actual
    // host/port/base-path, not a hard-coded constant.
    // We need the analysisId ahead of time to embed it in the URL; the service
    // receives the pre-built URL rather than constructing it internally.
    const analysisId = randomUUID();
    const imageUrl = buildImageUrl(req, sessionId, analysisId, file.originalname);

    return this.analysesService.createAnalysis(sessionId, goal, imageUrl, analysisId, {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
  }

  @Get(':id')
  getAnalysis(@Req() req: AuthedRequest, @Param('id') id: string): Promise<Analysis> {
    const { sessionId } = req.session;
    return this.analysesService.getAnalysis(
      id,
      sessionId,
      buildFallbackImageUrl(req, sessionId, id),
    );
  }

  @Post(':id/follow-up')
  @HttpCode(200)
  createFollowUp(
    @Req() req: AuthedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<FollowUpAnswer> {
    const parsed = FollowUpRequestSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      const first = issues[0];
      const message = first
        ? first.message
        : 'Invalid question. Must be between 3 and 500 characters.';
      throw new BadRequestException(
        errorEnvelope('invalid_question', message),
      );
    }

    const { sessionId } = req.session;
    return this.analysesService.addFollowUp(id, sessionId, parsed.data.question);
  }
}

// ---------------------------------------------------------------------------
// Public image-serving controller (no auth required)
// ---------------------------------------------------------------------------

@Controller('images')
export class ImagesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Get(':sessionId/:analysisId/:filename')
  async serveImage(
    @Param('sessionId') sessionId: string,
    @Param('analysisId') analysisId: string,
    @Param('filename') _filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const stored = await this.analysesService.getImageBuffer(sessionId, analysisId);

    if (!stored) {
      throw new NotFoundException(
        errorEnvelope('not_found', 'Image not found.'),
      );
    }

    res.set('Content-Type', stored.mimetype);
    res.set('Content-Length', String(stored.buffer.length));
    res.set('Cache-Control', 'no-store');
    res.send(stored.buffer);
  }
}
