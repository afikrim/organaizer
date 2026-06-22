import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InMemorySessionRepository, SessionRepository } from './session.repository';
import { InMemoryAnalysisRepository, AnalysisRepository } from './analysis.repository';
import { ImageStorage, InMemoryImageStorage } from './image.storage';
import { PrismaService } from './prisma.service';
import { PrismaSessionRepository } from './prisma-session.repository';
import { PrismaAnalysisRepository } from './prisma-analysis.repository';
import { PrismaImageStorage } from './prisma-image.storage';
import { SupabaseImageStorage } from './supabase-image.storage';

// ---------------------------------------------------------------------------
// Driver detection
// ---------------------------------------------------------------------------

const PERSISTENCE_DRIVER = (process.env['PERSISTENCE_DRIVER'] ?? 'memory').toLowerCase();
const STORAGE_DRIVER = (process.env['STORAGE_DRIVER'] ?? PERSISTENCE_DRIVER).toLowerCase();

const useSupabaseForImages = STORAGE_DRIVER === 'supabase';
const usePrismaForSessions = PERSISTENCE_DRIVER === 'prisma';
// Images use Prisma only when explicitly requested via STORAGE_DRIVER, or inherited
// from a Prisma persistence driver — but never when Supabase is selected for images.
const usePrismaForImages =
  !useSupabaseForImages &&
  (STORAGE_DRIVER === 'prisma' || PERSISTENCE_DRIVER === 'prisma');

// Fail fast at module load time if Prisma was requested but DATABASE_URL is absent.
// PrismaService is still required whenever sessions use Prisma, even if images go to Supabase.
if ((usePrismaForSessions || usePrismaForImages || useSupabaseForImages) && !process.env['DATABASE_URL']) {
  throw new Error(
    '[PersistenceModule] PERSISTENCE_DRIVER/STORAGE_DRIVER is set to "prisma" but ' +
      'DATABASE_URL is not defined. Set DATABASE_URL in your environment or .env file, ' +
      'or remove the PERSISTENCE_DRIVER override to use the default memory driver.',
  );
}

// Fail fast if Supabase Storage was requested but its required vars are absent.
if (useSupabaseForImages) {
  const missing = [
    !process.env['SUPABASE_URL'] ? 'SUPABASE_URL' : null,
    !process.env['SUPABASE_SERVICE_ROLE_KEY'] ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(
      `[PersistenceModule] STORAGE_DRIVER is set to "supabase" but ${missing.join(
        ' and ',
      )} ${missing.length > 1 ? 'are' : 'is'} not defined. ` +
        'Set them in your environment or .env file, or remove the STORAGE_DRIVER override.',
    );
  }
}

// ---------------------------------------------------------------------------
// Module
// ---------------------------------------------------------------------------

@Module({
  providers: [
    // PrismaService is only instantiated when at least one Prisma adapter is active,
    // or when Supabase Storage is used (it needs Prisma to write the image_objects FK row).
    ...(usePrismaForSessions || usePrismaForImages || useSupabaseForImages ? [PrismaService] : []),

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
      useClass: useSupabaseForImages
        ? SupabaseImageStorage
        : usePrismaForImages
          ? PrismaImageStorage
          : InMemoryImageStorage,
    },
  ],
  exports: [SessionRepository, AnalysisRepository, ImageStorage],
})
export class PersistenceModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(PersistenceModule.name);

  onApplicationBootstrap(): void {
    const sessionDriver = usePrismaForSessions ? 'prisma' : 'memory';
    const imageDriver = useSupabaseForImages
      ? 'supabase'
      : usePrismaForImages
        ? 'prisma'
        : 'memory';
    this.logger.log(
      `Persistence drivers: sessions=${sessionDriver}, analyses=${sessionDriver}, images=${imageDriver}`,
    );
  }
}
