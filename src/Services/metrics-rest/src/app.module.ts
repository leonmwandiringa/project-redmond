import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { MetricModule } from "./metrics/metric.module";
@Module({
  imports: [
    MetricModule,
    MongooseModule.forRoot('mongodb://leontinashe:Kamnyu3d@ds121321.mlab.com:21321/eazivent', { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
