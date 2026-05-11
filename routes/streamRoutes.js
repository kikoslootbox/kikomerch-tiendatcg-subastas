const express = require("express");

const router = express.Router();

const StreamSchedule = require(
  "../models/StreamSchedule"
);

/* =========================
GET ALL STREAMS
========================= */

router.get("/", async(req,res)=>{

  try{

    const streams =

    await StreamSchedule.find()
    .sort({createdAt:-1});

    res.json(streams);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});

/* =========================
CREATE STREAM
========================= */

router.post("/", async(req,res)=>{

  try{

    const newStream =

    new StreamSchedule({

      day:req.body.day,

      title:req.body.title,

      time:req.body.time

    });

    await newStream.save();

    res.status(201).json(
      newStream
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});

/* =========================
DELETE STREAM
========================= */

router.delete("/:id", async(req,res)=>{

  try{

    await StreamSchedule.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:"Horario eliminado"
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});

/* =========================
UPDATE STREAM
========================= */

router.put("/:id", async(req,res)=>{

  try{

    const updatedStream =

    await StreamSchedule.findByIdAndUpdate(

      req.params.id,

      {

        day:req.body.day,

        title:req.body.title,

        time:req.body.time

      },

      {new:true}

    );

    res.json(updatedStream);

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});

module.exports = router;