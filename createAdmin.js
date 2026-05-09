require("dotenv").config();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

  console.log("Mongo Connected");

  // PASSWORD EXACTO

  const plainPassword = "123456";

  console.log("PLAIN:", plainPassword);

  // HASH

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    10
  );

  console.log("HASH:", hashedPassword);

  // CREATE ADMIN

  const admin = new Admin({

    username:"admin",

    password:hashedPassword

  });

  await admin.save();

  console.log("Admin creado correctamente");

  process.exit();

})
.catch(err=>{

  console.log(err);

});