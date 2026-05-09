const SealedProduct = require("../models/SealedProduct");

exports.getAll = async(req,res)=>{

  const products = await SealedProduct.find();

  res.json(products);
};

exports.create = async(req,res)=>{

  const product = new SealedProduct(req.body);

  await product.save();

  res.json(product);
};

exports.delete = async(req,res)=>{

  await SealedProduct.findByIdAndDelete(req.params.id);

  res.json({message:"Deleted"});
};