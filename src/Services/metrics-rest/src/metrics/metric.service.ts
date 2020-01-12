import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MetricService{
    constructor(@InjectModel('Metric') private readonly _metric: Model<any>){}

    async getUser(cell: any){
        return await this._metric.findOne({cell: cell}).exec();
    }

}