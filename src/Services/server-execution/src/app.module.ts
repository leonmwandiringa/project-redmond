import { Module } from '@nestjs/common';
import { ExecutionModule } from "./executions/execution.module";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    ExecutionModule,
    MongooseModule.forRoot('mongodb://dopr:Dopr101@ds059898.mlab.com:59898/dopr-executions', { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
