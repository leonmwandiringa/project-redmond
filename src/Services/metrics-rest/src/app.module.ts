import { Module } from '@nestjs/common';
import { MetricModule } from "./metrics/metric.module";
import { StatModule } from "./stats/stat.module";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    MetricModule,
    StatModule,
    MongooseModule.forRoot('mongodb://dopr:Dopr101@ds211099.mlab.com:11099/dopr-resources', { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
