import { Module } from '@nestjs/common';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertSchema } from "./alert.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Alert', schema: AlertSchema}])
  ],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
