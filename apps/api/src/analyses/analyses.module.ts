import { Module } from '@nestjs/common';
import { AnalysesController, ImagesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { SessionsModule } from '../sessions/sessions.module';
import { VisionModule } from '../vision/vision.module';

@Module({
  imports: [SessionsModule, VisionModule],
  controllers: [AnalysesController, ImagesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
