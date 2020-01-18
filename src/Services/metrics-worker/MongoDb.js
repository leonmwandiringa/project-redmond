const mongoose = require('mongoose');
mongoose.connect('mongodb://dopr:Dopr101@ds211099.mlab.com:11099/dopr-resources', {useNewUrlParser: true});

const UserContainers = mongoose.model('UserContainers', new mongoose.Schema({
    user_id: String,
    server_name: String,
    metrics: Array
}, {strict: false, timestamps: true}));

const UserImages = mongoose.model(
  "UserImages",
  new mongoose.Schema(
    {
        user_id: String,
        server_name: String,
        metrics: Array
    },
    { strict: false, timestamps: true }
  )
);

module.exports = {
    UserContainers,
    UserImages
}