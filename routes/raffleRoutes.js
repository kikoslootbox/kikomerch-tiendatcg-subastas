const express = require("express");

const router = express.Router();

const Raffle = require(
  "../models/Raffle"
);

/* =========================
GET
========================= */

router.get("/", async(req,res)=>{

  const raffles =
  await Raffle.find();

  res.json(raffles);

});

/* =========================
CREATE
========================= */

router.post("/", async(req,res)=>{

  const newRaffle =

  new Raffle({

    title:req.body.title,

    tickets:req.body.tickets,

    sold:req.body.sold

  });

  await newRaffle.save();

  res.json(newRaffle);

});

/* =========================
DELETE
========================= */

router.delete("/:id", async(req,res)=>{

  await Raffle.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:"Deleted"
  });

});

module.exports = router;