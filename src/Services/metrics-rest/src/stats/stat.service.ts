import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatService{
    constructor(@InjectModel('UserContainer') private readonly _userContainer: Model<any>, @InjectModel('UserImage') private readonly _userImage: Model<any>){
    }

    async getContainerStats(userid){
        return await this._userContainer.find({user_id: userid}).exec();
    }

}