import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { SessionsModule } from './sessions/sessions.module';
import { AnalysesModule } from './analyses/analyses.module';

@Module({
  imports: [HealthModule, SessionsModule, AnalysesModule],
})
export class AppModule {}
