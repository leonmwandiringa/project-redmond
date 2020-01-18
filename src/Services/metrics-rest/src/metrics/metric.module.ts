import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  imports: [
  ],
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
