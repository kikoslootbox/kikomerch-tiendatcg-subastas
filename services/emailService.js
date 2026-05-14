const transporter =
require("../config/email");

/* =========================================
ORDER CONFIRMATION
========================================= */

async function sendOrderEmail(order){

  try{

    await transporter.sendMail({

      from:
      `"KikosLootBox" <${process.env.EMAIL_USER}>`,

      to:
      order.shippingAddress.email,

      subject:
      "Orden Confirmada | KikosLootBox",

      html:`

      <div style="
      background:#050816;
      padding:40px;
      color:white;
      font-family:Arial;
      ">

        <h1 style="
        color:#38bdf8;
        ">
          Gracias por tu compra
        </h1>

        <p>
          Tu orden fue creada exitosamente.
        </p>

        <h2>
          Orden:
        </h2>

        <p>
          ${order._id}
        </p>

        <h2>
          Total:
        </h2>

        <p>
          $${order.total} MXN
        </p>

      </div>

      `

    });

  }catch(err){

    console.log(err);

  }

}

/* =========================================
TRACKING EMAIL
========================================= */

async function sendTrackingEmail(order){

  try{

    await transporter.sendMail({

      from:
      `"KikosLootBox" <${process.env.EMAIL_USER}>`,

      to:
      order.shippingAddress.email,

      subject:
      "Tu orden fue enviada",

      html:`

      <div style="
      background:#050816;
      padding:40px;
      color:white;
      font-family:Arial;
      ">

        <h1 style="
        color:#38bdf8;
        ">
          Tu orden va en camino
        </h1>

        <p>
          Tracking Number:
        </p>

        <h2>
          ${order.trackingNumber}
        </h2>

      </div>

      `

    });

  }catch(err){

    console.log(err);

  }

}

module.exports = {

  sendOrderEmail,

  sendTrackingEmail

};