// Testing db routes 

const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Test database connection route
router.get("/test", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release(); // Important: release the connection back to the pool

    res.json({
      message: "Database connection successful",
      connected: true,
    });
  } catch (error) {
    console.error("Connection error details:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      connected: false,
    });
  }
});

// Add this route to see table structures
router.get("/tables/structure", async (req, res) => {
  try {
    const [users] = await pool.query('DESCRIBE users');
    const [verifications] = await pool.query('DESCRIBE email_verifications');
    
    res.json({
      message: "Table structures retrieved successfully",
      structures: {
        users,
        email_verifications: verifications
      }
    });
  } catch (error) {
    console.error("Error retrieving table structures:", error);
    res.status(500).json({
      message: "Failed to retrieve table structures",
      error: error.message
    });
  }
});

// Add this route after your existing /api/test route
router.get("/tables", async (req, res) => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    res.json({
      message: "Tables retrieved successfully",
      tables: tables.map(table => Object.values(table)[0])
    });
  } catch (error) {
    console.error("Error retrieving tables:", error);
    res.status(500).json({
      message: "Failed to retrieve tables",
      error: error.message
    });
  }
});

module.exports = router;