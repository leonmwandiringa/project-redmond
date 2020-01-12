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
class InfluxDb{
    constructor(){
        influx.getDatabaseNames()
        .then(names=>{
            console.log(names)
            if(names.indexOf('doprstats') == -1){
                return influx.createDatabase('doprstats');
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
                fields: {data: JSON.stringify(data)}
            } 
        ]).then(() => {   
            console.log('Added data to the Db', userid, type, server);         
        });
    }
}
let db = new InfluxDb;
module.exports = db;

