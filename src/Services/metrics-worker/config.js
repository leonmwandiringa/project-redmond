const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    INFLUX_PORT: process.env.INFLUX_PORT,
    INFLUX_PASSWORD: process.env.INFLUX_PASSWORD,
    INFLUX_USERNAME: process.env.INFLUX_USERNAME,
    INFLUX_DATABASE: process.env.INFLUX_DATABASE,
    INFLUX_HOST: process.env.INFLUX_HOST,
    RABBITMQ_CONNECTION_STRING: process.env.RABBITMQ_CONNECTION_STRING,
    MONGO_TEST: process.env.MONGO_TEST
}