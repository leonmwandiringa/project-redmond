import { Module } from '@nestjs/common';
import { ExecutionModule } from "./executions/execution.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MONGO_TEST } from  '../config.js';

@Module({
  imports: [
    ExecutionModule,
    MongooseModule.forRoot(MONGO_TEST, { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
