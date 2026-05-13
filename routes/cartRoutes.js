const express =
require("express");

const router =
express.Router();

const Cart =
require("../models/Cart");

const auth =
require("../middleware/auth");

/* =========================================
GET USER CART
========================================= */

router.get(
"/",
auth,

async(req,res)=>{

  try{

    let cart =

    await Cart.findOne({

      user:req.user.id

    });

    if(!cart){

      cart =

      await Cart.create({

        user:req.user.id,

        items:[]

      });

    }

    res.json(cart);

  }catch(err){

    res.status(500).json({

      message:err.message

    });

  }

});

/* =========================================
ADD TO CART
========================================= */

router.post(
"/add",
auth,

async(req,res)=>{

  try{

    const {

      productId,
      title,
      image,
      category,
      price

    } = req.body;

    let cart =

    await Cart.findOne({

      user:req.user.id

    });

    if(!cart){

      cart =
      new Cart({

        user:req.user.id,

        items:[]

      });

    }

    const existing =

    cart.items.find(

      item =>

      item.productId ===
      productId

    );

    if(existing){

      existing.quantity += 1;

    }else{

      cart.items.push({

        productId,
        title,
        image,
        category,
        price,
        quantity:1

      });

    }

    await cart.save();

    res.json(cart);

  }catch(err){

    res.status(500).json({

      message:err.message

    });

  }

});

module.exports =
router;