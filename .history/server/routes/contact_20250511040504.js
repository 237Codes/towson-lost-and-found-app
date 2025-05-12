const express = require("express");
const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  console.log("📩 Contact form submitted:", { name, email, message });

  // TODO: Send email using a service like Nodemailer, Resend, etc.

  res.status(200).json({ success: true, message: "Message received!" });
});

module.exports = router;
