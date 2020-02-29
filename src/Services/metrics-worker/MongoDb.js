const mongoose = require('mongoose');
let env = require("./config");
mongoose.connect(env.MONGO_TEST, {useNewUrlParser: true});

const UserContainers = mongoose.model('UserContainers', new mongoose.Schema({
    user_id: String,
    server_name: String,
    metrics: Object,
}, {strict: false, timestamps: true}));

// const UserImages = mongoose.model(
//   "UserImages",
//   new mongoose.Schema(
//     {
//         user_id: String,
//         server_name: String,
//         metrics: [new mongoose.Schema({
//           image_id: String
//         }, {strict: false, _id: false})]
//     },
//     { strict: false, timestamps: true }
//   )
// );

module.exports = {
    UserContainers
}