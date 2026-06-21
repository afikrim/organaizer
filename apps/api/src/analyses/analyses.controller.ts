import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
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

const MAX_FILE_SIZE_BYTES = parseInt(
  process.env['MAX_FILE_SIZE_MB'] ?? '8',
  10,
) * 1024 * 1024;

type AuthedRequest = Request & { session: Session };

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
  ): Analysis {
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

    return this.analysesService.createAnalysis(sessionId, goal, file.originalname);
  }

  @Get(':id')
  getAnalysis(@Req() req: AuthedRequest, @Param('id') id: string): Analysis {
    const { sessionId } = req.session;
    return this.analysesService.getAnalysis(id, sessionId);
  }

  @Post(':id/follow-up')
  @HttpCode(200)
  createFollowUp(
    @Req() req: AuthedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ): FollowUpAnswer {
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
