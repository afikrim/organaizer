import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionService } from './session.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionsModule {}
