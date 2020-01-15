import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
let Influx = require("influx");
const influx= new Influx.InfluxDB({
    host: 'localhost',
    database: 'doprstats',
    username: "admin",
    password: "SuperDopr102G", 
    port:8086,
    schema: [
        {
          measurement: 'stats',
          fields: { data: Influx.FieldType.STRING },
          tags: ['userid', 'server', 'type']
        }
      ]
});

@Injectable()
export class MetricService{
    constructor(@InjectModel('Metric') private readonly _metric: Model<any>){
        influx.getDatabaseNames()
        .then(names=>{
            console.log(names)
            if(names.indexOf('doprstats') == -1){
                return influx.createDatabase('doprstats');
            }
        });
    }

    async getUserServerContainerMetrics(id: any){
        influx.query(
            `select * from stats where userid=${id}`
        )
        .catch(err=>{
            console.log(err);
        })
        .then(results=>{
            return results;
        }); 
    }

    async getUserServerImageMetrics(id: any){
        influx.query(
            `select * from stats where userid=${id}`
        )
        .catch(err=>{
            console.log(err);
        })
        .then(results=>{
            return results;
        }); 
    }

}