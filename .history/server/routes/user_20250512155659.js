const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// POST /api/items — Submit a new item (lost or found)
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

    if (!name || !email || !itemName || !description || !location || !date || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Check if user exists
    let user_id;
    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE tu_email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      const insertUser = await pool.query(
        `INSERT INTO users (first_name, last_name, tu_email, phone_number, role, is_email_verified) 
         VALUES ($1, $2, $3, $4, 'student', false)
         RETURNING user_id`,
        [
          name.split(" ")[0],
          name.split(" ").slice(1).join(" ") || "",
          email,
          phone || null,
        ]
      );
      user_id = insertUser.rows[0].user_id;
    } else {
      user_id = userResult.rows[0].user_id;
    }

    const clean = (v) => (v === "" ? null : v);

    const insertItem = await pool.query(
      `INSERT INTO items 
      (user_id, type, title, category, color, brand, description, location_lost, date_lost, 
       drop_off_location, preferred_contact_method, allow_contact, verification_tip, 
       is_returned, is_high_value, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false, false, CURRENT_TIMESTAMP)
      RETURNING id`,
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
        canContact ? true : false,
        clean(verificationTip),
      ]
    );

    const item_id = insertItem.rows[0].id;

    console.log(`✅ Item inserted (ID: ${item_id}) for user ID: ${user_id}`);
    res.status(201).json({ success: true, item_id });

  } catch (error) {
    console.error("❌ Error inserting item:", error);
    res.status(500).json({ success: false, message: "Error inserting item", error: error.message });
  }
});

// GET /api/items — Fetch all or filtered items
router.get("/", async (req, res) => {
  try {
    const { location, type } = req.query;

    let whereClauses = [`is_returned = false`];
    let values = [];
    let paramIndex = 1;

    if (location) {
      whereClauses.push(`location_lost = $${paramIndex++}`);
      values.push(location);
    }

    if (type === "lost" || type === "found") {
      whereClauses.push(`type = $${paramIndex++}`);
      values.push(type);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT 
         id, 
         type,
         title AS name, 
         category, 
         location_lost AS location, 
         date_lost AS date, 
         description, 
         preferred_contact_method AS contact 
       FROM items
       ${whereSQL}
       ORDER BY date_lost DESC
       LIMIT 100`,
      values
    );

    const items = result.rows;

    if (type === "lost") {
      return res.json({ lost: items });
    } else if (type === "found") {
      return res.json({ found: items });
    } else {
      const lostItems = items.filter((i) => i.type === "lost");
      const foundItems = items.filter((i) => i.type === "found");
      return res.json({ lost: lostItems, found: foundItems });
    }

  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ success: false, message: "Error fetching items", error: error.message });
  }
});

module.exports = router;
