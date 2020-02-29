var amqp = require('amqplib');
let env = require("./config");
let CONN_URL = env.RABBITMQ_CONNECTION_STRING;
// let CONN_URL = `amqp://dopr_rabbit_admin:0dsaoFl6tdsfw0d43d@localhost:5672`;

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

async function pruneContainersData(payload){
  //var containerIds = Object.keys(containersData)
  //var containerMetrics = [];
  let queMessage;
  queMessage = {
                  'server_name': payload.data.stats_data, 
                  'user_id': payload.user_id, 
                  stats:payload.data.stats_data, 
                  metrics: { 
                    data: payload.data.container_data ? 
                    payload.data.container_data.container_metrics : null, 
                    time: payload.data.time
                  }
                }
  await persistToMongoContainer(queMessage)

}

// consume messages from RabbitMQ
function consume({ connection, channel }) {
  return new Promise((resolve, reject) => {
    channel.consume("client-server-metrics", async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let payload = JSON.parse(msgBody)

      pruneContainersData(payload)
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
    let update = payload.metrics.data ? {metrics: payload.metrics, stats: payload.stats} : {stats: payload.stats}
      await UserContainers.findOneAndUpdate({'user_id': payload.user_id, 'server_name': payload.server_name}, 
      update, {upsert: true, new: true, runValidators: true})
}

listenForResults()