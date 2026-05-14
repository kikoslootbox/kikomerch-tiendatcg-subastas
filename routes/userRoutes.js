const multer =
require("multer");

const cloudinary =
require("../config/cloudinary");

const storage =
multer.memoryStorage();

const upload =
multer({
  storage
});

const express =
require("express");

const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

const router =
express.Router();

const User =
require("../models/User");

/* =========================================
REGISTER
========================================= */

router.post(
"/register",
async(req,res)=>{

  try{

    const {

      username,
      email,
      password

    } = req.body;

    /* =========================
       CHECK USER
    ========================= */

    const existingUser =
    await User.findOne({

      $or:[
        {email},
        {username}
      ]

    });

    if(existingUser){

      return res.status(400)
      .json({

        message:
        "Usuario ya existe"

      });

    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

    /* =========================
       CREATE USER
    ========================= */

    const user =
    new User({

      username,
      email,

      password:
      hashedPassword

    });

    await user.save();

    res.json({

      message:
      "Cuenta creada"

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
LOGIN
========================================= */

router.post(
"/login",
async(req,res)=>{

  try{

    const {

      email,
      password

    } = req.body;

    /* =========================
       FIND USER
    ========================= */

    const user =
    await User.findOne({
      email
    });

    if(!user){

      return res.status(400)
      .json({

        message:
        "Usuario no encontrado"

      });

    }

    /* =========================
       CHECK PASSWORD
    ========================= */

    const validPassword =
    await bcrypt.compare(

      password,

      user.password

    );

    if(!validPassword){

      return res.status(400)
      .json({

        message:
        "Password incorrecto"

      });

    }

    /* =========================
       JWT
    ========================= */

    const token =
    jwt.sign(

      {

        id:user._id,

        role:user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn:"7d"

      }

    );

    res.json({

      token,

      role:user.role,

      userId:user._id,

      username:user.username

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
GET MY PROFILE
========================================= */

router.get(
"/profile",

async(req,res)=>{

  try{

    const token =
    req.headers.authorization;

    if(!token){

      return res.status(401)
      .json({
        message:"No token"
      });

    }

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    const user =
    await User.findById(
      decoded.id
    );

    res.json(user);

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:err.message
    });

  }

});

/* =========================================
UPDATE MY PROFILE
========================================= */

router.put(
"/profile",

async(req,res)=>{

  try{

    const token =
    req.headers.authorization;

    if(!token){

      return res.status(401)
      .json({
        message:"No token"
      });

    }

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    const updatedUser =

    await User.findByIdAndUpdate(

      decoded.id,

      req.body,

      {new:true}

    );

    res.json(updatedUser);

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:err.message
    });

  }

});

/* =========================================
UPLOAD AVATAR
========================================= */

router.put(

"/profile/avatar",

upload.single("avatar"),

async(req,res)=>{

  try{

    console.log(req.file);

    const token =
    req.headers.authorization;

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    /* =========================
    CLOUDINARY
    ========================= */

    const uploaded =

    await cloudinary.uploader.upload(

      `data:${
        req.file.mimetype
      };base64,${
        req.file.buffer.toString(
          "base64"
        )
      }`

    );

    /* =========================
    SAVE URL
    ========================= */

    const updatedUser =

    await User.findByIdAndUpdate(

      decoded.id,

      {
        avatar:
        uploaded.secure_url
      },

      {new:true}

    );

    console.log(
      updatedUser.avatar
    );

    res.json(updatedUser);

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:err.message

    });

  }

});

/* =========================================
UPLOAD BANNER
========================================= */

router.put(

"/profile/banner",

upload.single("banner"),

async(req,res)=>{

  try{

    const token =
    req.headers.authorization;

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    const uploaded =

    await cloudinary.uploader.upload(

      `data:${
        req.file.mimetype
      };base64,${
        req.file.buffer.toString(
          "base64"
        )
      }`

    );

    const updatedUser =

    await User.findByIdAndUpdate(

      decoded.id,

      {
        banner:
        uploaded.secure_url
      },

      {new:true}

    );

    console.log(
      updatedUser.banner
    );

    res.json(updatedUser);

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:err.message

    });

  }

});

/* =========================================
SAVE ADDRESS
========================================= */

router.put(
"/save-address",

async(req,res)=>{

  try{

    const token =
    req.headers.authorization;

    if(!token){

      return res.status(401)
      .json({

        message:"No token"

      });

    }

    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    const user =

    await User.findById(
      decoded.id
    );

    user.savedAddress =
    req.body.address;

    await user.save();

    res.json({

      message:
      "Address saved"

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});

module.exports = router;