const mongoose = require("mongoose");

const rawCardSchema = new mongoose.Schema({

  franchise: String,

  set:String,

  name: String,

  condition: String,

  description: String,

  price: Number,

  stock:{
  type:Number,
  default:1
},

  image: String

});

module.exports = mongoose.model("RawCard", rawCardSchema);