import { Module } from '@nestjs/common';
import { ExecutionModule } from "./executions/execution.module";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    ExecutionModule,
    MongooseModule.forRoot('mongodb://dopr:Dopr101@ds211099.mlab.com:11099/dopr-executions', { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
