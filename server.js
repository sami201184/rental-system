const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const chaletName = "شاليه";
const pricePerHour = 50;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/create-invoice", async (req, res) => {

  try {

    const hours = Number(req.body.hours);

    if (!hours || hours < 1) {
      return res.status(400).send("عدد الساعات غير صحيح");
    }

    const total = hours * pricePerHour;

    const amountInHalala = total * 100;

    const response = await fetch(
      "https://api.moyasar.com/v1/invoices",
      {
        method: "POST",

        headers: {
          "Authorization":
            "Basic " +
            Buffer.from(
              process.env.MOYASAR_SECRET_KEY + ":"
            ).toString("base64"),

          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          amount: amountInHalala,

          currency: "SAR",

          description:
            `حجز ${chaletName} لمدة ${hours} ساعة`,

          callback_url:
            `${process.env.BASE_URL}/payment-callback`,

          success_url:
            `${process.env.BASE_URL}/success?hours=${hours}&total=${total}`,

          back_url:
            process.env.BASE_URL

        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.log("Moyasar Error:", data);

  return res.status(500).send(`
    <html dir="rtl">
    <body style="font-family:Tahoma;padding:20px">
      <h2>خطأ من Moyasar</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </body>
    </html>
  `);
}

    res.redirect(data.url);

  } catch (error) {

    console.error(error);

    res.status(500).send("خطأ في السيرفر");
  }
});

app.post("/payment-callback", async (req, res) => {

  try {

    const invoice = req.body;

    if (invoice.status === "paid") {

      await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: process.env.OWNER_EMAIL,

        subject: "تم دفع حجز جديد",

        text: `

تم دفع حجز جديد

الشاليه: ${chaletName}

المبلغ: ${invoice.amount / 100} ريال

رقم الفاتورة: ${invoice.id}

الحالة: ${invoice.status}

        `
      });
    }

    res.sendStatus(200);

  } catch (error) {

    console.error(error);

    res.sendStatus(500);
  }
});

app.get("/success", (req, res) => {

  const hours = req.query.hours;

  const total = req.query.total;

  res.send(`

  <html dir="rtl">

  <head>

  <title>تم الدفع</title>

  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>

  <style>

  body{
    font-family:Tahoma;
    background:#f3f4f6;
    padding:20px;
  }

  .box{
    max-width:450px;
    margin:auto;
    background:white;
    padding:20px;
    border-radius:20px;
    text-align:center;
    box-shadow:0 0 15px rgba(0,0,0,0.1);
  }

  .info{
    background:#ecfdf5;
    padding:15px;
    border-radius:12px;
    line-height:2;
    margin-top:20px;
  }

  </style>

  </head>

  <body>

  <div class="box">

    <h1>تم الدفع بنجاح</h1>

    <div class="info">

      <b>الشاليه:</b> شاليه<br>

      <b>عدد الساعات:</b> ${hours}<br>

      <b>سعر الساعة:</b> 50 ريال<br>

      <b>الإجمالي:</b> ${total} ريال<br>

      <b>الحالة:</b> مدفوع

    </div>

    <div id="qrcode">

      <h3>باركود الدخول</h3>

      <canvas id="qr"></canvas>

    </div>

  </div>

  <script>

  QRCode.toCanvas(
    document.getElementById("qr"),
    window.location.href
  );

  </script>

  </body>

  </html>

  `);
});

app.listen(process.env.PORT, () => {

  console.log(
    "Server running on port " +
    process.env.PORT
  );

});