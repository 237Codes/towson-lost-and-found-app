const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication routes
router.post("/register", authController.register);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login); // Add login route if needed

module.exports = router;
