import { Module } from '@nestjs/common';
import { InMemorySessionRepository, SessionRepository } from './session.repository';
import { InMemoryAnalysisRepository, AnalysisRepository } from './analysis.repository';
import { ImageStorage, InMemoryImageStorage } from './image.storage';

@Module({
  providers: [
    { provide: SessionRepository, useClass: InMemorySessionRepository },
    { provide: AnalysisRepository, useClass: InMemoryAnalysisRepository },
    { provide: ImageStorage, useClass: InMemoryImageStorage },
  ],
  exports: [SessionRepository, AnalysisRepository, ImageStorage],
})
export class PersistenceModule {}
