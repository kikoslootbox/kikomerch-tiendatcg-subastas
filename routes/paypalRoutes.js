const express =
require("express");

const router =
express.Router();

const paypalClient =
require("../config/paypal");

const paypal =
require("@paypal/checkout-server-sdk");

const auth =
require("../middleware/auth");

const Cart =
require("../models/Cart");

const Order =
require("../models/Order");

/* =========================================
CREATE PAYPAL ORDER
========================================= */

router.post(
"/create-order",

auth,

async(req,res)=>{

  try{

    const cart =

    await Cart.findOne({

      user:req.user.id

    });

    if(!cart ||

      cart.items.length === 0

    ){

      return res.status(400)
      .json({

        msg:"Cart empty"

      });

    }

    const total =

    cart.items.reduce(

      (sum,item)=>

      sum +

      (item.price *
      item.quantity),

      0

    );

    const request =

    new paypal.orders.OrdersCreateRequest();

    request.prefer(
      "return=representation"
    );

    request.requestBody({

      intent:"CAPTURE",

      purchase_units:[

        {

          amount:{

            currency_code:"MXN",

            value:total.toFixed(2)

          }

        }

      ]

    });

    const order =

    await paypalClient.execute(
      request
    );

    res.json({

      id:order.result.id

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      msg:"PayPal error"

    });

  }

});

/* =========================================
CAPTURE PAYMENT
========================================= */

router.post(
"/capture-order",

auth,

async(req,res)=>{

  try{

    const {

      orderID,

      shippingAddress

    } = req.body;

    const request =

    new paypal.orders.OrdersCaptureRequest(
      orderID
    );

    request.requestBody({});

    const capture =

    await paypalClient.execute(
      request
    );

    const cart =

    await Cart.findOne({

      user:req.user.id

    });

    const subtotal =

    cart.items.reduce(

      (sum,item)=>

      sum +

      (item.price *
      item.quantity),

      0

    );

    const order =

    new Order({

      user:req.user.id,

      items:cart.items,

      shippingAddress,

      paymentMethod:"PayPal",

      subtotal,

      shipping:0,

      total:subtotal,

      status:"Paid"

    });

    await order.save();

    cart.items = [];

    await cart.save();

    res.json({

      success:true,

      order

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      msg:"Capture failed"

    });

  }

});

module.exports =
router;