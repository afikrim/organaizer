import { Module } from '@nestjs/common';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { SessionsModule } from '../sessions/sessions.module';
import { VisionModule } from '../vision/vision.module';

@Module({
  imports: [SessionsModule, VisionModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
