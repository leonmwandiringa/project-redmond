import { Injectable } from '@nestjs/common';

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
          fields: { data: Influx.FieldType.STRING, time: Influx.FieldType.INTEGER },
          tags: ['userid', 'server', 'type']
        }
      ]
});

@Injectable()
export class MetricService{
    constructor(){
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
            `SELECT * FROM doprstats WHERE userid=${id}`
        )
        .catch(err=>{
            console.log("fsdfsdfsd", err);
        })
        .then(results=>{
            console.log(results)
            return results;
        }); 
    }

    async getUserServerImageMetrics(id: any){
        influx.query(
            `select * from doprstats where userid=${id}`
        )
        .catch(err=>{
            console.log(err);
        })
        .then(results=>{
            return results;
        }); 
    }

}