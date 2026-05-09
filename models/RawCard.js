const mongoose = require("mongoose");

const rawCardSchema = new mongoose.Schema({

  franchise: String,

  name: String,

  condition: String,

  description: String,

  price: Number,

  image: String

});

module.exports = mongoose.model("RawCard", rawCardSchema);