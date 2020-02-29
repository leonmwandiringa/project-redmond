const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_TEST: process.env.MONGO_TEST
}