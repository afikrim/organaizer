import { Module } from '@nestjs/common';
import { MockVisionProvider } from './mock-vision.provider';

@Module({
  providers: [MockVisionProvider],
  exports: [MockVisionProvider],
})
export class VisionModule {}
