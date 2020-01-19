var amqp = require('amqplib');
let CONN_URL = `amqp://dopr_rabbit_admin:0dsaoFl6tdsfw0d43d@localhost:5672`;
//let influx = require("./InfluxDB");
let { UserContainers } = require("./MongoDb");

async function listenForResults() {
  // connect to Rabbit MQ
  let connection = await amqp.connect(CONN_URL);

  // create a channel and prefetch 1 message at a time
  let channel = await connection.createChannel();
  await channel.prefetch(1);

  // start consuming messages
  await consume({ connection, channel });
}

async function pruneContainersData(containersData, server, time, userid){
  var containerIds = Object.keys(containersData)
  var containerMetrics = [];
  let payload;
  for(let i = 0; i < containerIds.length; i++){
    //console.log(containerIds[i])
    if(containerIds[i] || containerIds[i] != ""){
      payload = {'server_name': server, 'user_id': userid, metrics: { data: JSON.parse(containersData[containerIds[i]])[0], container_id: containerIds[i], time: time}}
      //influx.addToDb(payload, userid, "container", server)
      containerMetrics.push(payload)
    }
  }
  await persistToMongoContainer(containerMetrics)
  //console.log(containerMetrics)
}

// async function pruneImagesData(imagesData, server, time, userid){
//   var imageIds = Object.keys(imagesData)
//   var imageMetrics = [];
//   let payload;
//   for(let i = 0; i < imageIds.length; i++){
//     //console.log(containerIds[i])
//     if(imageIds[i] || imageIds[i] != ""){
//       payload = {'server_name': server, 'user_id': userid, metrics: {data: JSON.parse(imagesData[imageIds[i]])[0], image_id: imageIds[i], time: time}}
//       //influx.addToDb(payload, userid, "image", server)
//       imageMetrics.push(payload)
//     }
//   }
//   await persistToMongoImage(imageMetrics)
// }

// consume messages from RabbitMQ
function consume({ connection, channel }) {
  return new Promise((resolve, reject) => {
    channel.consume("client-server-metrics", async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let payload = JSON.parse(msgBody)

      pruneContainersData(payload.data.data.container_metrics, payload.data.stats, payload.data.time, payload.user_id)
      //pruneImagesData(payload.data.data.image_metrics, payload.data.stats, payload.data.time, payload.user_id)
      // acknowledge message as received
      await channel.ack(msg);
    });

    // handle connection closed
    connection.on("close", (err) => {
      return reject(err); err;
    });

    // handle errors
    connection.on("error", (err) => {
      return reject(err);
    });
  });
}

async function persistToMongoContainer(payload){
  for(var i = 0; i < payload.length; i++){
      // await UserContainers.findOneAndUpdate({'user_id': payload[i].user_id, 'server_name': payload[i].server_name}, 
      // { $pull: { "metrics.container_id": payload.metrics[i].container_id } }, { safe: true, multi:true })

      await UserContainers.findOneAndUpdate({'user_id': payload[i].user_id, 'server_name': payload[i].server_name}, 
      {$push:{metrics: payload[i].metrics}}, {upsert: true, new: true, runValidators: true})
  }
    
}

// async function persistToMongoImage(payload){
//   for(var i = 0; i < payload.length; i++){
//       // await UserImages.findOneAndUpdate({'user_id': payload[i].user_id, 'server_name': payload[i].server_name}, 
//       // { $pull: { "metrics.image_id": payload[i].metrics.image_id } }, { safe: true, multi:true })

//       await UserImages.findOneAndUpdate({'user_id': payload[i].user_id, 'server_name': payload[i].server_name}, 
//       {$push: { metrics: payload[i].metrics }}, {upsert: true, new: true, runValidators: true})
//   }
// }
listenForResults()