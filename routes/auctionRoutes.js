const auth =
require("../middleware/auth");

const cloudinary =
require("../config/cloudinary");

const upload =
require("../middleware/upload");

const express = require("express");

const router = express.Router();

const Auction =
require("../models/Auction");

/* =========================================
GET ALL AUCTIONS
========================================= */

router.get("/",async(req,res)=>{

  try{

    const auctions =
    await Auction.find()
    .sort({createdAt:-1});

    res.json(auctions);

  }catch(err){

    res.status(500).json({
      message:err.message
    });

  }

});

/* =========================================
CREATE AUCTION
========================================= */

router.post(
"/",
auth,
upload.array("images",10),

async(req,res)=>{

  try{

    const uploadedImages = [];

    /* =========================
       UPLOAD IMAGES
    ========================= */

    for(const file of req.files){

      const base64 =
      `data:${
        file.mimetype
      };base64,${
        file.buffer.toString("base64")
      }`;

      const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder:"kikos-auctions"
        }
      );

      uploadedImages.push(
        result.secure_url
      );

    }

    

    /* =========================
       CREATE AUCTION
    ========================= */

    const auction =
    new Auction({

      title:req.body.title,

      description:
      req.body.description,

      startingPrice:
      req.body.startingPrice,

      reservePrice:
      req.body.reservePrice,

      currentBid:
      req.body.startingPrice,

      duration:durationHours,

      endTime,

      category:
      req.body.category,

      shipping:
      req.body.shipping,

      seller:req.user.id,

      images:uploadedImages,

      bids:0,

      watchers:0

    });

    await auction.save();

    res.json(auction);

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:err.message
    });

  }

});

/* =========================================
DELETE AUCTION
========================================= */

router.delete(
"/:id",
auth,

async(req,res)=>{

  try{

    const auction =
    await Auction.findById(
      req.params.id
    );

    if(!auction){

      return res.status(404)
      .json({

        message:
        "Auction not found"

      });

    }

    /* =========================
       OWNER CHECK
    ========================= */

    if(

      auction.seller.toString()

      !==

      req.user.id

    ){

      return res.status(403)
      .json({

        message:
        "Unauthorized"

      });

    }

    await Auction.findByIdAndDelete(
      req.params.id
    );

    res.json({

      message:
      "Auction deleted"

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});

/* =========================================
UPDATE AUCTION
========================================= */

router.put(
"/:id",
auth,

async(req,res)=>{

  try{

    const auction =
    await Auction.findById(
      req.params.id
    );

    if(!auction){

      return res.status(404)
      .json({

        message:
        "Auction not found"

      });

    }

    /* =========================
       OWNER CHECK
    ========================= */

    if(

      auction.seller.toString()

      !==

      req.user.id

    ){

      return res.status(403)
      .json({

        message:
        "Unauthorized"

      });

    }

    const updated =
    await Auction.findByIdAndUpdate(

      req.params.id,

      req.body,

      {new:true}

    );

    res.json(updated);

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});

module.exports = router;

/* =========================================
USER DASHBOARD STATS
========================================= */

router.get(
"/user/stats/:userId",

async(req,res)=>{

  try{

    const userId =
    req.params.userId;

    /* =========================
       ACTIVE
    ========================= */

    const activeAuctions =
    await Auction.countDocuments({

      seller:userId,

      ended:false

    });

    /* =========================
       ENDING SOON
    ========================= */

    const endingSoon =
    await Auction.countDocuments({

      seller:userId,

      ended:false,

      endTime:{
        $lte:
        new Date(
          Date.now()

          +

          24 * 60 * 60 * 1000
        )
      }

    });

    /* =========================
       SOLD
    ========================= */

    const soldAuctions =
    await Auction.find({

      seller:userId,

      sold:true

    });

    /* =========================
       TOTAL SALES
    ========================= */

    const totalSales =
    soldAuctions.length;

    /* =========================
       REVENUE
    ========================= */

    let revenue = 0;

    soldAuctions.forEach(auction=>{

      revenue +=
      auction.finalPrice || 0;

    });

    res.json({

      activeAuctions,

      endingSoon,

      totalSales,

      revenue

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});