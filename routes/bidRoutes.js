const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth");

const Bid =
require("../models/Bid");

const Auction =
require("../models/Auction");

/* =========================================
PLACE BID
========================================= */

router.post(
"/:auctionId",
auth,

async(req,res)=>{

  try{

    const {

      amount

    } = req.body;

    const auction =
    await Auction.findById(
      req.params.auctionId
    );

    /* =========================
       CHECK AUCTION
    ========================= */

    if(!auction){

      return res.status(404)
      .json({

        message:
        "Auction not found"

      });

    }

    /* =========================
       CHECK ENDED
    ========================= */

    if(auction.ended){

      return res.status(400)
      .json({

        message:
        "Auction ended"

      });

    }

    /* =========================
       BID VALIDATION
    ========================= */

    if(

      Number(amount)

      <=

      Number(auction.currentBid)

    ){

      return res.status(400)
      .json({

        message:
        "Bid too low"

      });

    }

    /* =========================
       CREATE BID
    ========================= */

    const bid =
    new Bid({

      auction:
      auction._id,

      bidder:
      req.user.id,

      amount

    });

    await bid.save();

    /* =========================
       UPDATE AUCTION
    ========================= */

    auction.currentBid =
    amount;

    auction.bids += 1;

    auction.highestBidder =
    req.user.id;

    await auction.save();

    res.json({

      message:
      "Bid placed",

      bid

    });

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});

/* =========================================
GET BIDS
========================================= */

router.get(
"/:auctionId",

async(req,res)=>{

  try{

    const bids =
    await Bid.find({

      auction:
      req.params.auctionId

    })

    .populate(
      "bidder",
      "username"
    )

    .sort({
      createdAt:-1
    });

    res.json(bids);

  }catch(err){

    console.log(err);

    res.status(500).json({

      message:
      err.message

    });

  }

});

module.exports =
router;