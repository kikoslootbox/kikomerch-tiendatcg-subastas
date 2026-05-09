const mongoose = require("mongoose");

const sealedSchema = new mongoose.Schema({

  franchise: String,

  name: String,

  description: String,

  price: Number,

  image: String

});

module.exports = mongoose.model("SealedProduct", sealedSchema);