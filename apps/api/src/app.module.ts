import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { SessionsModule } from './sessions/sessions.module';
import { AnalysesModule } from './analyses/analyses.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [ObservabilityModule, HealthModule, SessionsModule, AnalysesModule],
})
export class AppModule {}
