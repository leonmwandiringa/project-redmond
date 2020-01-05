import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
@Module({
  imports: [
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
