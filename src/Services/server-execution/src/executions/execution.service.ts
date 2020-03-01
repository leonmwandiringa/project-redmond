import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExecutionSchema } from './execution.schema';

@Injectable()
export class ExecutionService{
    constructor(@InjectModel('Execution') private readonly _execution: Model<any>){
        
    }

    async setExecutions(payload: any){
         let executionIsAlreadyInQueue = await this._execution.findOne({
                                            user_id: payload.user_id,
                                            target: payload.target,
                                            instruction: payload.instruction,
                                            satisfied: false,
                                            server_name: payload.server_name
                                        }).exec();
        if(executionIsAlreadyInQueue){
            return {
                status: false,
                message: "Instruction has already been sent to server",
                data: payload
            }
        }

        let executionSaved = new this._execution({
                                user_id: payload.user_id,
                                target: payload.target,
                                instruction: payload.instruction,
                                satisfied: false,
                                requested_at: payload.requested_at,
                                server_name: payload.server_name
                            });
        await executionSaved.save();
        return {
            status: true,
            message: "Instruction was successfully queue to run in the next server command",
            data: executionSaved
        }
    }

    async getServerExecutions(userid, servername){
        return await this._execution.find({user_id: userid, server_name: servername}).exec();
    }

}