const router = require("express").Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

// =========================
// LOGIN
// =========================

router.post("/login", async(req,res)=>{

  try{

    const {username,password} = req.body;

    const admin = await Admin.findOne({username});

    if(!admin){

      return res.status(401).json({
        message:"Admin no encontrado"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if(!validPassword){

      return res.status(401).json({
        message:"Password incorrecto"
      });
    }

    const token = jwt.sign(
      {
        id:admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"7d"
      }
    );

    res.json({
      token
    });

  }catch(err){

    res.status(500).json(err);

  }

});

module.exports = router;