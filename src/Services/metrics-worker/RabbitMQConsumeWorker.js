var amqp = require('amqplib');
let CONN_URL = `amqp://dopr_rabbit_admin:0dsaoFl6tdsfw0d43d@localhost:5672`;

async function listenForResults() {
  // connect to Rabbit MQ
  let connection = await amqp.connect(CONN_URL);

  // create a channel and prefetch 1 message at a time
  let channel = await connection.createChannel();
  await channel.prefetch(1);

  // start consuming messages
  await consume({ connection, channel });
}

function pruneContainersData(containersData, server){
  var containerIds = Object.keys(containersData)
  var containerMetrics = [];
  for(let i = 0; i < containerIds.length; i++){
    //console.log(containerIds[i])
    if(containerIds[i] || containerIds[i] != ""){
      containerMetrics.push({server_running: server, container_id: containerIds[i], data: JSON.parse(containersData[containerIds[i]])[0]})
    }
  }
  console.log(containerMetrics)
}

// consume messages from RabbitMQ
function consume({ connection, channel }) {
  return new Promise((resolve, reject) => {
    channel.consume("client-server-metrics", async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let payload = JSON.parse(msgBody)
      pruneContainersData(payload.data.container_metrics, payload.data.stats)
      //console.log("Received a result message, requestId:", pruneContainersData(payload.data.container_metrics) );

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
listenForResults()