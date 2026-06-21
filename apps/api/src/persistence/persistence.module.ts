import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InMemorySessionRepository, SessionRepository } from './session.repository';
import { InMemoryAnalysisRepository, AnalysisRepository } from './analysis.repository';
import { ImageStorage, InMemoryImageStorage } from './image.storage';
import { PrismaService } from './prisma.service';
import { PrismaSessionRepository } from './prisma-session.repository';
import { PrismaAnalysisRepository } from './prisma-analysis.repository';
import { PrismaImageStorage } from './prisma-image.storage';

// ---------------------------------------------------------------------------
// Driver detection
// ---------------------------------------------------------------------------

const PERSISTENCE_DRIVER = (process.env['PERSISTENCE_DRIVER'] ?? 'memory').toLowerCase();
const STORAGE_DRIVER = (process.env['STORAGE_DRIVER'] ?? PERSISTENCE_DRIVER).toLowerCase();

const usePrismaForSessions = PERSISTENCE_DRIVER === 'prisma';
const usePrismaForImages = STORAGE_DRIVER === 'prisma' || PERSISTENCE_DRIVER === 'prisma';

// Fail fast at module load time if Prisma was requested but DATABASE_URL is absent.
if ((usePrismaForSessions || usePrismaForImages) && !process.env['DATABASE_URL']) {
  throw new Error(
    '[PersistenceModule] PERSISTENCE_DRIVER/STORAGE_DRIVER is set to "prisma" but ' +
      'DATABASE_URL is not defined. Set DATABASE_URL in your environment or .env file, ' +
      'or remove the PERSISTENCE_DRIVER override to use the default memory driver.',
  );
}

// ---------------------------------------------------------------------------
// Module
// ---------------------------------------------------------------------------

@Module({
  providers: [
    // PrismaService is only instantiated when at least one Prisma adapter is active.
    ...(usePrismaForSessions || usePrismaForImages ? [PrismaService] : []),

    {
      provide: SessionRepository,
      useClass: usePrismaForSessions ? PrismaSessionRepository : InMemorySessionRepository,
    },
    {
      provide: AnalysisRepository,
      useClass: usePrismaForSessions ? PrismaAnalysisRepository : InMemoryAnalysisRepository,
    },
    {
      provide: ImageStorage,
      useClass: usePrismaForImages ? PrismaImageStorage : InMemoryImageStorage,
    },
  ],
  exports: [SessionRepository, AnalysisRepository, ImageStorage],
})
export class PersistenceModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(PersistenceModule.name);

  onApplicationBootstrap(): void {
    const sessionDriver = usePrismaForSessions ? 'prisma' : 'memory';
    const imageDriver = usePrismaForImages ? 'prisma' : 'memory';
    this.logger.log(
      `Persistence drivers: sessions=${sessionDriver}, analyses=${sessionDriver}, images=${imageDriver}`,
    );
  }
}
