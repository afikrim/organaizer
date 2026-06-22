import { Controller, Get } from '@nestjs/common';
import { MetricsService, type MetricsSnapshot } from '../observability/metrics.service';

const startTime = Date.now();

@Controller()
export class HealthController {
  constructor(private readonly metrics: MetricsService) {}

  @Get('health')
  getHealth(): { status: 'ok'; uptime: number } {
    return {
      status: 'ok',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };
  }

  @Get('metrics')
  getMetrics(): MetricsSnapshot {
    return this.metrics.snapshot();
  }
}
