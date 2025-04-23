// User route file

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Get all users
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, first_name, last_name, tu_email, role FROM users"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const [user] = await db.query(
      "SELECT user_id, first_name, last_name, tu_email, role FROM users WHERE user_id = ?",
      [req.params.id]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, tuEmail, password, phoneNumber } = req.body;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (first_name, last_name, tu_email, password_hash, phone_number) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, tuEmail, passwordHash, phoneNumber]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;