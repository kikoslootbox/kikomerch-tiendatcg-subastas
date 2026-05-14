const mongoose =
require("mongoose");

const userSchema =
new mongoose.Schema({

  username:{
    type:String,
    required:true,
    unique:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  savedAddress:{
  type:String,
  default:""
},

  role:{
    type:String,
    default:"user"
  },

  rating:{
    type:Number,
    default:5
  },

  tagline:{
  type:String,
  default:"Top Rated Seller"
},

bio:{
  type:String,
  default:""
},

kick:{
  type:String,
  default:""
},

twitch:{
  type:String,
  default:""
},

youtube:{
  type:String,
  default:""
},

tiktok:{
  type:String,
  default:""
},

discord:{
  type:String,
  default:""
},

avatar:{
  type:String,
  default:""
},

banner:{
  type:String,
  default:""
},

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  "User",
  userSchema
);