const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Helper to sanitize empty values
const clean = (v) => (v === "" ? null : v);

// POST /api/items — Submit a new item (lost or found)
router.post("/", async (req, res) => {
  let connection;
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

    connection = await pool.getConnection();

    // Check if user exists
    let user_id;
    const [userRows] = await connection.query("SELECT user_id FROM users WHERE tu_email = ?", [email]);

    if (userRows.length === 0) {
      const [insertUser] = await connection.query(
        `INSERT INTO users (first_name, last_name, tu_email, phone_number, role, is_email_verified) 
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

    const [result] = await connection.query(
      `INSERT INTO items 
      (user_id, type, title, category, color, brand, description, location_lost, date_lost, 
       drop_off_location, preferred_contact_method, allow_contact, verification_tip, 
       is_returned, is_high_value, created_at) 
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

    console.log(`✅ Item inserted (ID: ${result.insertId}) for user ID: ${user_id}`);
    res.status(201).json({ success: true, item_id: result.insertId });

  } catch (error) {
    console.error("❌ Error inserting item:", error);
    res.status(500).json({ success: false, message: "Error inserting item", error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// GET /api/items — Fetch all or filtered items
router.get("/", async (req, res) => {
  let connection;
  try {
    const { location, type } = req.query;

    let whereClauses = [`is_returned = 0`];
    let values = [];

    if (location) {
      whereClauses.push("location_lost = ?");
      values.push(location);
    }

    if (type === "lost" || type === "found") {
      whereClauses.push("type = ?");
      values.push(type);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    connection = await pool.getConnection();
    const [items] = await connection.query(
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
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
