import { Module } from '@nestjs/common';
import { AlertModule } from "./alerts/alert.module";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    AlertModule,
    MongooseModule.forRoot(process.env.MONGO_TEST, { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
