import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionService } from './session.service';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [SessionsController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionsModule {}
