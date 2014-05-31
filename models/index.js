// Imports
var mongoose = require("mongoose");

// Connect
mongoose.connect(require(__dirname + "/../config").Mongo.url, function(err) { if (err) console.log(err); } );

// Exports
module.exports = {
  Comment     : require(__dirname + "/comment")(mongoose),
  List        : require(__dirname + "/list")(mongoose),
  ListUser    : require(__dirname + "/listUser")(mongoose),
  User        : require(__dirname + "/user")(mongoose),
  Vote        : require(__dirname + "/vote")(mongoose)
};