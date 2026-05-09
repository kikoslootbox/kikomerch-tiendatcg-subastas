const KikoMerch = require("../models/KikoMerch");

exports.getAll = async(req,res)=>{

  const merch = await KikoMerch.find();

  res.json(merch);
};

exports.create = async(req,res)=>{

  const item = new KikoMerch(req.body);

  await item.save();

  res.json(item);
};

exports.delete = async(req,res)=>{

  await KikoMerch.findByIdAndDelete(req.params.id);

  res.json({message:"Deleted"});
};