import * as Influx from "influx";
const influx= new Influx.InfluxDB({
    host: 'localhost',
    database: 'statistics',
    username: "",
    password: "", 
    port:8086
});
module.exports=influx;

