const mongoose = require("mongoose");

const streamScheduleSchema =

new mongoose.Schema({

  day:{
    type:String,
    required:true
  },

  title:{
    type:String,
    required:true
  },

  time:{
    type:String,
    required:true
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model(
  "StreamSchedule",
  streamScheduleSchema
);