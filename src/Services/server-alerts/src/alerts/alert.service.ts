import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AlertService{
    constructor(@InjectModel('Alert') private readonly _alert: Model<any>){
    }

    async createServerAlert(payload: any){
        let alertIsAlreadyInQueue = await this._alert.findOne({
                                           user_id: payload.user_id,
                                           target: payload.target,
                                           instruction: payload.instruction,
                                           server_name: payload.server_name
                                       }).exec();
       if(alertIsAlreadyInQueue){
           return {
               status: false,
               message: "Alert has already been sent to server",
               data: payload
           }
       }

       let alertSaved = new this._alert({
                                user_id: payload.user_id,
                                target: payload.target,
                                instruction: payload.instruction,
                                counter: 0,
                                server_name: payload.server_name
                           });
       await alertSaved.save();
       return {
           status: true,
           message: "Alert was successfully queue to the server",
           data: alertSaved
       }
   }

    async getServerAlerts(userid, servername){
        return await this._alert.find({user_id: userid, server_name: servername}).exec();
    }

}