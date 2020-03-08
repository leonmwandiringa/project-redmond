import { Module } from '@nestjs/common';
import { AlertModule } from "./alerts/alert.module";
import { MongooseModule } from "@nestjs/mongoose";
import { MONGO_TEST } from  '../config.js';
@Module({
  imports: [
    AlertModule,
    MongooseModule.forRoot(MONGO_TEST, { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
