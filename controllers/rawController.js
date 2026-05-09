const RawCard = require("../models/RawCard");

exports.getAll = async(req,res)=>{

  const cards = await RawCard.find();

  res.json(cards);
};

exports.create = async(req,res)=>{

  const card = new RawCard(req.body);

  await card.save();

  res.json(card);
};

exports.delete = async(req,res)=>{

  await RawCard.findByIdAndDelete(req.params.id);

  res.json({message:"Deleted"});
};