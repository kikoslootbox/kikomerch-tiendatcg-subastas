const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth");

const Cart =
require("../models/Cart");

const Order =
require("../models/Order");

/* =========================================
CREATE ORDER
========================================= */

router.post(
"/create",

auth,

async(req,res)=>{

  try{

    const {

      shippingAddress,

      paymentMethod,

      couponCode

    } = req.body;

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

    const subtotal =

    cart.items.reduce(

      (sum,item)=>

      sum +

      (item.price *
      item.quantity),

      0

    );

    let discount = 0;

    if(couponCode ===
      "KIKO10"){

      discount =
      subtotal * .10;

    }

    const shipping = 0;

    const total =

    subtotal -
    discount +
    shipping;

    const order =

    new Order({

      user:req.user.id,

      items:cart.items,

      shippingAddress,

      paymentMethod,

      subtotal,

      shipping,

      total,

      couponCode,

      discount

    });

    await order.save();

    cart.items = [];

    await cart.save();

    res.json(order);

  }catch(err){

    console.log(err);

    res.status(500).json({

      msg:"Error creating order"

    });

  }

});

module.exports =
router;

/* =========================================
GET ALL ORDERS
========================================= */

router.get(
"/admin/all",

async(req,res)=>{

  try{

    const orders =

    await Order.find()

    .sort({

      createdAt:-1

    });

    res.json(orders);

  }catch(err){

    console.log(err);

    res.status(500).json({

      msg:"Server error"

    });

  }

});

/* =========================================
UPDATE ORDER STATUS
========================================= */

router.put(
"/admin/status/:id",

async(req,res)=>{

  try{

    const order =

    await Order.findById(
      req.params.id
    );

    order.status =
    req.body.status;

    order.trackingNumber =
    req.body.trackingNumber || "";

    await order.save();

    res.json(order);

  }catch(err){

    console.log(err);

    res.status(500).json({

      msg:"Server error"

    });

  }

});

/* =========================================
CASH ORDER
========================================= */

router.post(
"/cash-order",

auth,

async(req,res)=>{

  try{

    const {

      shippingAddress,

      meetingZone

    } = req.body;

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

      paymentMethod:
      "Cash",

      subtotal,

      shipping:0,

      total:subtotal,

      status:
      "Pending Cash",

      meetingZone

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

      msg:"Cash order error"

    });

  }

});

router.get(
"/my-orders",

auth,

async(req,res)=>{

  try{

    const orders =

    await Order.find({

      user:req.user.id

    })

    .sort({
      createdAt:-1
    });

    res.json(orders);

  }catch(err){

    console.log(err);

    res.status(500).json({
      msg:"Server error"
    });

  }

});