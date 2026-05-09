require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// MODELS
// =========================

const Slab = require("./models/GradedSlab");
const Raw = require("./models/RawCard");
const Sealed = require("./models/SealedProduct");
const Merch = require("./models/KikoMerch");

// =========================
// MONGODB
// =========================

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Mongo Connected"))
.catch(err=> console.log(err));

// =========================
// CRUD ROUTES
// =========================

function createRoutes(model,route){

  // GET
  app.get(`/api/${route}`, async(req,res)=>{

    try{

      const data = await model.find();

      res.json(data);

    }catch(err){

      res.status(500).json(err);

    }
  });

  // POST
  app.post(`/api/${route}`, async(req,res)=>{

    try{

      const newItem = new model(req.body);

      await newItem.save();

      res.json(newItem);

    }catch(err){

      res.status(500).json(err);

    }
  });

  // DELETE
  app.delete(`/api/${route}/:id`, async(req,res)=>{

    try{

      await model.findByIdAndDelete(req.params.id);

      res.json({message:"Deleted"});

    }catch(err){

      res.status(500).json(err);

    }
  });

  // EDIT
  app.put(`/api/${route}/:id`, async(req,res)=>{

    try{

      const updated = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
      );

      res.json(updated);

    }catch(err){

      res.status(500).json(err);

    }
  });
}

// =========================
// ROUTES
// =========================

app.use("/api/admin", require("./routes/adminRoutes"));


createRoutes(Slab,"slabs");

createRoutes(Raw,"raw");

createRoutes(Sealed,"sealed");

createRoutes(Merch,"merch");

// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

  console.log(`Server Running on ${PORT}`);

});