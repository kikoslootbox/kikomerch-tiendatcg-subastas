const mongoose = require("mongoose");

const contestSchema =

new mongoose.Schema({

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  image:{
    type:String,
    required:true
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model(
  "Contest",
  contestSchema
);