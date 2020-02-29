let Influx = require("influx");
let env = require("./config");
const influx= new Influx.InfluxDB({
    host: env.INFLUX_HOST,
    database: env.INFLUX_DATABASE,
    username: env.INFLUX_USERNAME,
    password: env.INFLUX_PASSWORD, 
    port:env.INFLUX_PORT,
    schema: [
        {
          measurement: 'stats',
          fields: { data: Influx.FieldType.STRING, time: Influx.FieldType.INTEGER  },
          tags: ['userid', 'server', 'type']
        }
      ]
});
class InfluxDb{
    constructor(){
        influx.getDatabaseNames()
        .then(names=>{
            console.log(names)
            if(names.indexOf(env.INFLUX_DATABASE) == -1){
                return influx.createDatabase(env.INFLUX_DATABASE);
            }
        });
    }

    addToDb(data, userid, type, server){
        influx.writePoints([   
            {     
                measurement: 'stats',     
                tags: {
                    userid: userid, 
                    server: server, 
                    type: type
                },     
                fields: {data: JSON.stringify(data), time: Date.now()}
            } 
        ]).then(() => {   
            console.log('Added data to the Db', userid, type, server);         
        });
    }
}
let db = new InfluxDb;
module.exports = db;

