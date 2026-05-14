const mongoose = require("mongoose");

const sealedSchema = new mongoose.Schema({

  franchise: String,
  
  set:String,

  name: String,

  description: String,

  price: Number,

  stock:{
  type:Number,
  default:1
},

  image: String

});

module.exports = mongoose.model("SealedProduct", sealedSchema);