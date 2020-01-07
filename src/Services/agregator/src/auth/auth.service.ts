import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
const accountSid = 'AC73167d5d3cc2f27e75e216ce61fb82d1';
const authToken = '599ac50cb10ed32b0445b0fe6e033f02';
const client = require('twilio')(accountSid, authToken);

@Injectable()
export class AuthService{
    constructor(@InjectModel('Auth') private readonly _auth: Model<any>){}

    async getUser(cell: any){
        return await this._auth.findOne({cell: cell}).exec();
    }

}