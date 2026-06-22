import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';

/**
 * Global so MetricsService can be injected anywhere (AnalysesService,
 * HealthController) without re-importing this module per feature module.
 */
@Global()
@Module({
  providers: [MetricsService],
  exports: [MetricsService],
})
export class ObservabilityModule {}
