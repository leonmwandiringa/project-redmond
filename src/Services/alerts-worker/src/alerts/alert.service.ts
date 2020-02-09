import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AlertService{
    constructor(@InjectModel('UserContainer') private readonly _userContainer: Model<any>, @InjectModel('UserImage') private readonly _userImage: Model<any>){
    }

    async getContainerAlerts(userid){
        return await this._userContainer.find({user_id: userid}).exec();
    }

    async getServerAlert(userid, servername){
        return await this._userContainer.findOne({user_id: userid, server_name: servername}).exec();
    }

}