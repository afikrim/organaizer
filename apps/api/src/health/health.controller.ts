import { Controller, Get } from '@nestjs/common';

const startTime = Date.now();

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: 'ok'; uptime: number } {
    return {
      status: 'ok',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };
  }
}
