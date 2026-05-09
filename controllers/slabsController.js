const GradedSlab = require("../models/GradedSlab");

exports.getAll = async(req,res)=>{

  const slabs = await GradedSlab.find();

  res.json(slabs);
};

exports.create = async(req,res)=>{

  const slab = new GradedSlab(req.body);

  await slab.save();

  res.json(slab);
};

exports.delete = async(req,res)=>{

  await GradedSlab.findByIdAndDelete(req.params.id);

  res.json({message:"Deleted"});
};