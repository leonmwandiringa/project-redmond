import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { UserContainerSchema } from "./UserContainer.schema";
import { UserImageSchema } from "./UserImage.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'UserContainer', schema: UserContainerSchema}]),
    MongooseModule.forFeature([{name: 'UserImage', schema: UserImageSchema}])
  ],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
