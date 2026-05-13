const mongoose =
require("mongoose");

const cartSchema =
new mongoose.Schema({

  user:{
    type:
    mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true
  },

  items:[{

    productId:String,

    title:String,

    image:String,

    category:String,

    price:Number,

    quantity:Number

  }]

},{timestamps:true});

module.exports =
mongoose.model(
  "Cart",
  cartSchema
);