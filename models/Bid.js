const mongoose =
require("mongoose");

const bidSchema =
new mongoose.Schema({

  auction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Auction"
  },

  bidder:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  amount:{
    type:Number,
    required:true
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  "Bid",
  bidSchema
);