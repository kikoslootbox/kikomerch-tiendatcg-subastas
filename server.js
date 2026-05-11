const bidRoutes =
require("./routes/bidRoutes");

const http =
require("http");

const { Server } =
require("socket.io");

require("dotenv").config();

const userRoutes = 
require("./routes/userRoutes");

const auctionRoutes = require("./routes/auctionRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const upload = require("./config/upload");

const nodemailer = require("nodemailer");

const app = express();

const server =
http.createServer(app);

const io =
new Server(server,{

  cors:{
    origin:"*"
  }

});

app.use(cors());
app.use(
  express.json({
    limit:"50mb"
  })
);

app.use(
  express.urlencoded({
    extended:true,
    limit:"50mb"
  })
);
app.use(
    "/api/auctions",
    auctionRoutes
);

app.use(
  "/api/users",
  userRoutes
);

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
  app.post(
  `/api/${route}`,
  upload.single("image"),
  async(req,res)=>{

    console.log(req.body);

console.log(req.file);

    try{

      const newItem = new model({

  ...req.body,

  image:req.file?.path

});

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

const streamRoutes = require(
  "./routes/streamRoutes"
);

const contestRoutes = require(
  "./routes/contestRoutes"
);

app.use(
  "/api/contests",
  contestRoutes
);

app.use(
  "/api/streams",
  streamRoutes
);

// =========================

const PORT =
process.env.PORT || 5000;

server.listen(
PORT,
"0.0.0.0",
()=>{

  console.log(
    `Server Running on ${PORT}`
  );

});

app.post(
  "/api/send-order-email",
  async(req,res)=>{

    try{

      const {
        product,
        name,
        phone,
        meetingPoint
      } = req.body;

      const transporter =
      nodemailer.createTransport({

        service:"gmail",

        auth:{

          user:
          process.env.EMAIL_USER,

          pass:
          process.env.EMAIL_PASS

        }

      });

      await transporter.sendMail({

        from:process.env.EMAIL_USER,

        to:"compras@kikoslootbox.com",

        subject:
        "Nueva Orden En Persona",

        html:`

          <h2>Nueva Orden</h2>

          <p><strong>Producto:</strong>
          ${product}</p>

          <p><strong>Nombre:</strong>
          ${name}</p>

          <p><strong>Teléfono:</strong>
          ${phone}</p>

          <p><strong>Punto de Encuentro:</strong>
          ${meetingPoint}</p>

        `

      });

      res.json({
        success:true
      });

    }catch(err){

      console.log(err);

      res.status(500).json(err);

    }

});

/* =========================================
AUTO END AUCTIONS
========================================= */

const Auction =
require("./models/Auction");

setInterval(async()=>{

  try{

    const now =
    new Date();

    await Auction.updateMany(

      {

        endTime:{
          $lte:now
        },

        ended:false

      },

      {

        ended:true,

        status:"ended"

      }

    );

  }catch(err){

    console.log(err);

  }

},60000);

/* =========================================
SOCKET.IO
========================================= */

io.on("connection",(socket)=>{

  console.log(
    "USER CONNECTED:",
    socket.id
  );

  /* =========================
     JOIN AUCTION ROOM
  ========================= */

  socket.on(
    "joinAuction",
    (auctionId)=>{

      socket.join(auctionId);

    }
  );

  /* =========================
     LIVE BID
  ========================= */

  socket.on(
    "newBid",
    async(data)=>{

      io.to(data.auctionId)
      .emit(
        "bidUpdated",
        data
      );

    }
  );

  socket.on(
    "disconnect",
    ()=>{

      console.log(
        "USER DISCONNECTED"
      );

    }
  );

});

const raffleRoutes = require(
  "./routes/raffleRoutes"
);

app.use(
  "/api/raffles",
  raffleRoutes
);