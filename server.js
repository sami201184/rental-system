const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));

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
app.post("/book", async (req, res) => {
  try {
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
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});