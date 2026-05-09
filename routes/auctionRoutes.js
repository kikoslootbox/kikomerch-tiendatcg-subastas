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

      seller:
      req.body.seller,

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

router.delete("/:id",async(req,res)=>{

  try{

    await Auction.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:"Auction deleted"
    });

  }catch(err){

    res.status(500).json({
      message:err.message
    });

  }

});

/* =========================================
UPDATE AUCTION
========================================= */

router.put("/:id",async(req,res)=>{

  try{

    const updated =
    await Auction.findByIdAndUpdate(

      req.params.id,

      req.body,

      {new:true}

    );

    res.json(updated);

  }catch(err){

    res.status(500).json({
      message:err.message
    });

  }

});

module.exports = router;