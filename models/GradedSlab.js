const mongoose = require("mongoose");

const gradedSlabSchema = new mongoose.Schema({

  franchise: String,

  name: String,

  gradeService: String,

  grade: String,

  description: String,

  price: Number,

  stock:{
  type:Number,
  default:1
},

  image: String

});

module.exports = mongoose.model("GradedSlab", gradedSlabSchema);