const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.post("/", async (req, res) => {
  let connection;
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    connection = await pool.getConnection();

    console.log("📩 Contact form submitted:", { name, email, message });

    res.status(200).json({ success: true, message: "Message received!" });
  } catch (error) {
    console.error("❌ Contact submission error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  } finally {
    if (connection) connection.release(); // ✅ Always release connection
  }
});

module.exports = router;
