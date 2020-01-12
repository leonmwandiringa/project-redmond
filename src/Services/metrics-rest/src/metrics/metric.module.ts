import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';
import { MongooseModule } from "@nestjs/mongoose";
import { MetricSchema } from "./metric.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Metric', schema: MetricSchema}])
  ],
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
