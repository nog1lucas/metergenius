import { Module } from '@nestjs/common';
import { MeasureController } from './measure.controller';
import { GeminiService } from './services/gemini.service';
import { MeasureService } from './services/measure.service';

@Module({
  controllers: [MeasureController],
  providers: [MeasureService, GeminiService],
})
export class MeasureModule {}
