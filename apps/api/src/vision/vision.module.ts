import { Module } from '@nestjs/common';
import { MockVisionProvider } from './mock-vision.provider';
import { GeminiVisionProvider } from './gemini-vision.provider';
import { VisionProvider } from './vision.provider';

@Module({
  providers: [
    {
      provide: VisionProvider,
      useFactory: () => {
        const driver = process.env['VISION_DRIVER'] ?? 'memory';
        if (driver === 'gemini') {
          return new GeminiVisionProvider();
        }
        return new MockVisionProvider();
      },
    },
  ],
  exports: [VisionProvider],
})
export class VisionModule {}