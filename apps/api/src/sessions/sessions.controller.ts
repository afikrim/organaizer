import { Controller, HttpCode, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import type { CreateSessionResponse } from '@organaizer/schema';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(201)
  async createSession(): Promise<CreateSessionResponse> {
    const session = await this.sessionService.createSession();
    return {
      sessionId: session.sessionId,
      token: session.token,
      createdAt: session.createdAt,
    };
  }
}
