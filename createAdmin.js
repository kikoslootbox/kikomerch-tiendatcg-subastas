require("dotenv").config();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

  console.log("Mongo Connected");

  // ELIMINAR ADMIN VIEJO

  await Admin.deleteMany({
    username:"admin"
  });

  // NUEVO PASSWORD

  const hashedPassword =
  await bcrypt.hash("123456",10);

  // CREAR ADMIN

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