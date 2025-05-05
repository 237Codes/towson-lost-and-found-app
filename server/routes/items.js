const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Submit new item (lost or found)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      itemName,
      category,
      colors,
      brand,
      description,
      location,
      date,
      dropoff,
      contactMethod,
      canContact,
      verificationTip,
      type,
    } = req.body;

    console.log("🛬 Received POST /api/items body:", req.body);

    if (!name || !email || !itemName || !description || !location || !date || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Create or find user
    let user_id;
    const [userRows] = await pool.query(
      "SELECT user_id FROM users WHERE tu_email = ?",
      [email]
    );

    if (userRows.length === 0) {
      const [insertUser] = await pool.query(
        `INSERT INTO users 
        (first_name, last_name, tu_email, phone_number, role, is_email_verified) 
        VALUES (?, ?, ?, ?, 'student', 0)`,
        [
          name.split(" ")[0],
          name.split(" ").slice(1).join(" ") || "",
          email,
          phone || null,
        ]
      );
      user_id = insertUser.insertId;
    } else {
      user_id = userRows[0].user_id;
    }

    // Clean fields: empty strings -> null
    const clean = (v) => (v === "" ? null : v);

    const [result] = await pool.query(
      `INSERT INTO items 
      (user_id, type, title, category, color, brand, description, location_lost, date_lost, drop_off_location, preferred_contact_method, allow_contact, verification_tip, is_returned, is_high_value, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW())`,
      [
        user_id,
        clean(type),
        clean(itemName),
        clean(category),
        Array.isArray(colors) && colors.length ? colors.join(", ") : null,
        clean(brand),
        clean(description),
        clean(location),
        clean(date),
        clean(dropoff),
        clean(contactMethod),
        canContact ? 1 : 0,
        clean(verificationTip),
      ]
    );

    console.log(`✅ Inserted item ${result.insertId} for user ${user_id}`);
    res.status(201).json({ success: true, item_id: result.insertId });
  } catch (error) {
    console.error("❌ Error inserting item:", error);
    res.status(500).json({
      success: false,
      message: "Error inserting item",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ success: false, message: "Missing location parameter." });
    }

    const [lostItems] = await pool.query(
      "SELECT id, title AS name, category, location_lost AS location, date_lost AS date, description, preferred_contact_method AS contact FROM items WHERE type = 'lost' AND location_lost = ? AND is_returned = 0",
      [location]
    );
    
    const [foundItems] = await pool.query(
      "SELECT id, title AS name, category, location_lost AS location, date_lost AS date, description, preferred_contact_method AS contact FROM items WHERE type = 'found' AND location_lost = ? AND is_returned = 0",
      [location]
    );    

    res.json({ lost: lostItems, found: foundItems });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ success: false, message: "Error fetching items", error: error.message });
  }
});

module.exports = router;
