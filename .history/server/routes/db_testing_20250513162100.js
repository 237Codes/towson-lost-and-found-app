const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Test database connection route
router.get("/test", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
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
  } finally {
    if (connection) connection.release();
  }
});

// Get structure of important tables
router.get("/tables/structure", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.query("DESCRIBE users");
    const [verifications] = await connection.query("DESCRIBE email_verifications");

    res.json({
      message: "Table structures retrieved successfully",
      structures: {
        users,
        email_verifications: verifications,
      },
    });
  } catch (error) {
    console.error("Error retrieving table structures:", error);
    res.status(500).json({
      message: "Failed to retrieve table structures",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

// List all table names
router.get("/tables", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [tables] = await connection.query("SHOW TABLES");

    res.json({
      message: "Tables retrieved successfully",
      tables: tables.map((table) => Object.values(table)[0]),
    });
  } catch (error) {
    console.error("Error retrieving tables:", error);
    res.status(500).json({
      message: "Failed to retrieve tables",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
