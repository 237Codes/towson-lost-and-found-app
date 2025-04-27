const bcrypt = require("bcrypt");
const { pool } = require("../db");
const EmailService = require("../emailverify/EmailService");

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { firstName, lastName, tuEmail, password } = req.body;

      // Validate Towson email
      if (!tuEmail.endsWith("@students.towson.edu")) {
        return res.status(400).json({
          success: false,
          message: "Must use a Towson University student email",
        });
      }

      // Check if user already exists
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE tu_email = ?",
        [tuEmail]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const [result] = await pool.query(
        `INSERT INTO users (first_name, last_name, tu_email, password_hash) 
                 VALUES (?, ?, ?, ?)`,
        [firstName, lastName, tuEmail, passwordHash]
      );

      // Send verification email
      const emailResult = await EmailService.sendVerificationEmail(tuEmail);
      if (!emailResult.success) {
        throw new Error("Failed to send verification email");
      }

      // Store verification code
      await pool.query(
        `INSERT INTO email_verifications (user_id, verification_token, expires_at) 
                 VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
        [result.insertId, emailResult.verificationCode]
      );

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for verification.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  },

  // Verify email
  verifyEmail: async (req, res) => {
    try {
      const { email, code } = req.body;

      const [verification] = await pool.query(
        `SELECT v.*, u.tu_email 
                 FROM email_verifications v 
                 JOIN users u ON v.user_id = u.user_id 
                 WHERE u.tu_email = ? AND v.verification_token = ? 
                 AND v.is_used = FALSE AND v.expires_at > NOW()`,
        [email, code]
      );

      if (!verification.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
      }

      // Mark email as verified
      await pool.query(
        "UPDATE users SET is_email_verified = TRUE WHERE tu_email = ?",
        [email]
      );

      // Mark verification code as used
      await pool.query(
        "UPDATE email_verifications SET is_used = TRUE WHERE verification_token = ?",
        [code]
      );

      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        message: "Verification failed",
        error: error.message,
      });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Get user
      const [users] = await pool.query(
        "SELECT * FROM users WHERE tu_email = ?",
        [email]
      );

      if (!users.length) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const user = users[0];

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if email is verified
      if (!user.is_email_verified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.user_id,
          email: user.tu_email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  },

  
};


module.exports = authController;
