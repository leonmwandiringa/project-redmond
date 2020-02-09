import { Module } from '@nestjs/common';
import { AlertModule } from "./alerts/alert.module";
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [
    AlertModule,
    MongooseModule.forRoot('mongodb://dopr:Dopr101@ds211099.mlab.com:11099/dopr-resources', { useNewUrlParser: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
