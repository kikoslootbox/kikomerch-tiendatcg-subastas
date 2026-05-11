const mongoose = require("mongoose");

const raffleSchema =

new mongoose.Schema({

  title:String,

  tickets:Number,

  sold:Number

});

module.exports = mongoose.model(
  "Raffle",
  raffleSchema
);