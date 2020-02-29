import { Module } from '@nestjs/common';
import { MetricModule } from "./metrics/metric.module";
import { StatModule } from "./stats/stat.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MONGO_TEST } from "../config";

@Module({
  imports: [
    MetricModule,
    StatModule,
    MongooseModule.forRoot(MONGO_TEST, { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
