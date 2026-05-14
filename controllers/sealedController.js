const SealedProduct =
require("../models/SealedProduct");

const cloudinary =
require("../config/cloudinary");

/* =========================
GET ALL
========================= */

exports.getAll = async(req,res)=>{

  const products =
  await SealedProduct.find();

  res.json(products);

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
    CREATE PRODUCT
    ===================== */

    const product =

    new SealedProduct({

      franchise:
      req.body.franchise,

      set:
      req.body.set,

      name:
      req.body.name,

      description:
      req.body.description,

      stock:
      req.body.stock || 1,

      price:
      req.body.price,

      image:
      imageUrl

    });

    await product.save();

    res.json(product);

  }catch(err){

    console.log(err);

    res.status(500).json({
      msg:"Error creating sealed product"
    });

  }

};

/* =========================
DELETE
========================= */

exports.delete = async(req,res)=>{

  await SealedProduct.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:"Deleted"
  });

};