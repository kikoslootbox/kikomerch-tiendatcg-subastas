const mongoose =
require("mongoose");

const orderSchema =
new mongoose.Schema({

  user:{
    type:
    mongoose.Schema.Types.ObjectId,

    ref:"User"
  },

  items:[

    {

      productId:String,

      title:String,

      image:String,

      quantity:Number,

      price:Number

    }

  ],

  shippingAddress:{

    fullName:String,

    email:String,

    phone:String,

    state:String,

    city:String,

    zip:String,

    address:String

  },

  paymentMethod:{
    type:String
  },

  subtotal:Number,

  shipping:Number,

  total:Number,

  couponCode:String,

  discount:Number,

  status:{

    type:String,

    default:"Pending"

  },

  trackingNumber:{

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
  "Order",
  orderSchema
);