const express = require("express");
const path = require("path");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "public/uploads/");
},

filename: function (req, file, cb) {
cb(null, Date.now() + path.extname(file.originalname));
}
});

const upload = multer({ storage });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
});
app.get("/setup-db", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        phone TEXT,
        hours INTEGER,
        total INTEGER,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price INTEGER NOT NULL,
    image TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    
    res.json({ success: true, message: "تم إنشاء جدول الحجوزات" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get("/admin/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
const PORT = process.env.PORT || 8080;
// حفظ حجز جديد
app.post("/add-property", upload.single("image"), async (req, res) => {  try {
    const {
      customer_name,
      phone,
      hours,
      total,
      status
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO bookings
      (customer_name, phone, hours, total, status)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        customer_name,
        phone,
        hours,
        total,
        status || "معلق"
      ]
    );

    res.json({
      success: true,
      booking: result.rows[0]
    });

  } catch (err) {
    console.log(err);

    res.json({
      success: false,
      error: err.message
    });
  }
});

// جلب الحجوزات
app.get("/bookings", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT * FROM bookings
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }
});
// صفحة تسجيل دخول الأدمن
app.get("/admin-login", (req, res) => {

res.send(`

<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>دخول الإدارة</title>

<style>

body{
font-family:tahoma;
background:#f3f4f6;
padding:40px;
}

.box{
max-width:400px;
margin:auto;
background:white;
padding:30px;
border-radius:15px;
box-shadow:0 0 10px rgba(0,0,0,.1);
}

input{
width:100%;
padding:15px;
margin-bottom:15px;
border:1px solid #ddd;
border-radius:10px;
font-size:16px;
}

button{
width:100%;
padding:15px;
background:#0f172a;
color:white;
border:none;
border-radius:10px;
font-size:18px;
cursor:pointer;
}

</style>

</head>

<body>

<div class="box">

<h2>تسجيل دخول الإدارة</h2>

<input type="text" id="username" placeholder="اسم المستخدم">

<input type="password" id="password" placeholder="كلمة المرور">

<button onclick="login()">
دخول
</button>

</div>

<script>

function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

if(
username === "admin" &&
password === "123456"
){

window.location.href = "/admin.html";

}else{

alert("بيانات الدخول غير صحيحة");

}

}

</script>

</body>
</html>

`);

});

app.post("/add-property", upload.single("image"), async (req, res) => {
try {

const { name, type, price } = req.body;
const image =
"/uploads/" + req.file.filename;

await pool.query(
`INSERT INTO properties (name, type, price, image)
VALUES ($1, $2, $3, $4)`,
[name, type, price, image]
);

res.json({
success: true,
message: "تمت إضافة العقار"
});

} catch (error) {

res.json({
success: false,
error: error.message
});

}

});

app.get("/properties", async (req, res) => {

try {

const result = await pool.query(
"SELECT * FROM properties ORDER BY id DESC"
);

res.json(result.rows);

} catch (error) {

res.json({
success: false,
error: error.message
});

}

});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});