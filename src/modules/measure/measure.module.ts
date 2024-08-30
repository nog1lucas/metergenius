import { Module } from '@nestjs/common';
import { MeasureController } from './measure.controller';
import { GeminiService } from './services/gemini.service';
import { MeasureService } from './services/measure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measure } from './entities/measure.entity';
import { MeasureRepository } from './repositories/measure.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Measure])],
  controllers: [MeasureController],
  providers: [MeasureService, GeminiService, MeasureRepository]
})
export class MeasureModule {}
