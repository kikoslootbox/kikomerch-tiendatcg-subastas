const mongoose = require("mongoose");

const merchSchema = new mongoose.Schema({

  image: String,

  name: String,

  price: Number,

  streamlabs: String

});

module.exports = mongoose.model("KikoMerch", merchSchema);