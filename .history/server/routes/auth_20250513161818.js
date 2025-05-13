const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const authController = require("../controllers/authController");

// Helper to wrap controller logic with DB connection handling
const withDbConnection = (handler) => async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await handler(req, res, connection);
  } catch (err) {
    console.error("❌ Error in route handler:", err.message);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) connection.release(); // ✅ Always release
  }
};

// Routes using DB connection injection
router.post("/register", withDbConnection(authController.register));
router.post("/verify", withDbConnection(authController.verifyEmail));
router.post("/login", withDbConnection(authController.login));

module.exports = router;
