const express = require("express");

const router = express.Router();

const upload = require("../config/upload");

const Contest = require(
  "../models/Contest"
);

/* =========================
GET
========================= */

router.get("/", async(req,res)=>{

  const contests =
  await Contest.find()
  .sort({createdAt:-1});

  res.json(contests);

});

/* =========================
CREATE
========================= */

router.post(
"/",

upload.single("image"),

async(req,res)=>{

  const newContest =

  new Contest({

    title:req.body.title,

    description:req.body.description,

    image:req.file?.path

  });

  await newContest.save();

  res.json(newContest);

});

/* =========================
DELETE
========================= */

router.delete("/:id", async(req,res)=>{

  await Contest.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:"Contest deleted"
  });

});

module.exports = router;