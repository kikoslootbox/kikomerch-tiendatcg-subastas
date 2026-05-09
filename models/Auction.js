const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  images:[String],

  startingPrice:{
    type:Number,
    required:true
  },

  reservePrice:{
    type:Number,
    default:0
  },

  currentBid:{
    type:Number,
    default:0
  },

  duration:{
  type:Number
},

  category:{
    type:String
  },

  shipping:{
    type:String
  },

  seller:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin"
  },

  status:{
    type:String,
    default:"active"
  },

  watchers:{
    type:Number,
    default:0
  },

  highestBidder:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
},

  bids:{
    type:Number,
    default:0
  },

  endTime:{
    type:Date
  },

  createdAt:{
    type:Date,
    default:Date.now
  },

  featured:{
  type:Boolean,
  default:false
},

ended:{
  type:Boolean,
  default:false
},

views:{
  type:Number,
  default:0
},

watchersList:[
  {
    type:String
  }
]

});

module.exports =
mongoose.model(
  "Auction",
  auctionSchema
);