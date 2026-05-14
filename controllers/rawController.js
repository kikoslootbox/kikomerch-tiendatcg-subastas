const RawCard =
require("../models/RawCard");

const cloudinary =
require("../config/cloudinary");

/* =========================
GET ALL
========================= */

exports.getAll = async(req,res)=>{

  const cards =
  await RawCard.find();

  res.json(cards);

};

/* =========================
CREATE
========================= */

exports.create = async(req,res)=>{

  try{

    let imageUrl = "";

    /* =====================
    UPLOAD IMAGE
    ===================== */

    if(req.file){

      const result =

      await cloudinary.uploader.upload(
        req.file.path
      );

      imageUrl =
      result.secure_url;

    }

    /* =====================
    CREATE CARD
    ===================== */

    const card =

    new RawCard({

      franchise:
      req.body.franchise,

      set:
      req.body.set,

      name:
      req.body.name,

      condition:
      req.body.condition,

      description:
      req.body.description,

      stock:
      req.body.stock || 1,

      price:
      req.body.price,

      image:
      imageUrl

    });

    await card.save();

    res.json(card);

  }catch(err){

    console.log(err);

    res.status(500).json({
      msg:"Error creating raw card"
    });

  }

};

/* =========================
DELETE
========================= */

exports.delete = async(req,res)=>{

  await RawCard.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:"Deleted"
  });

};