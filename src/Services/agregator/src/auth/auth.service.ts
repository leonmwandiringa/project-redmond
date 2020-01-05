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

    async sendCode(cell: any){
        let randomCode = Math.floor(100000 + Math.random() * 900000);
        let userExist = await this._auth.findOne({cell: cell});
        if(userExist){
            await this._auth.findOneAndUpdate({cell: cell}, {verification: {code: randomCode, date: new Date()}})
        }else{
            await this._auth.create({cell: cell, verification: {code: randomCode, date: new Date()}})
        }
        return await this.processSms(cell, randomCode);
    }

    async processSms(cell, body){

        client.messages
        .create({
            body: `${body}`,
            from: '+15017122661',
            to: `+27${cell}`
        })
        .then((message) => {
            console.log(message)
        });

    }

    async updateUser(user: any){
        let userExist = await this._auth.findOne({cell: user.cell});
        if(!userExist){
            return null;
        }
        let updatedUser = await this._auth.findOneAndUpdate({cell: user.cell}, user);
        return updatedUser;
    }
}