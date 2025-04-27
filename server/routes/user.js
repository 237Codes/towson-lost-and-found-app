// User route file

const express = require("express");
const router = express.Router();
const {pool} = require("../db");

// Get all users
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name, tu_email, role FROM users"
    );
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get users by ID
router.get("/:id", async (req, res) => {
  try {
    const [user] = await pool.query(
      // Changed from db.query to pool.query
      "SELECT user_id, first_name, last_name, tu_email, role FROM users WHERE user_id = ?",
      [req.params.id]
    );
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete user
router.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // First delete related records from email_verifications
    await pool.query(
      `DELETE v FROM email_verifications v 
       INNER JOIN users u ON v.user_id = u.user_id 
       WHERE u.tu_email = ?`,
      [email]
    );

    // Then delete the user
    const [result] = await pool.query(
      "DELETE FROM users WHERE tu_email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;