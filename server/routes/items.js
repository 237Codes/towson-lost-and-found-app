const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Helper function to clean empty strings
const clean = (v) => (v === "" ? null : v);

// POST /api/items — Submit a new item
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
      photo_base64,
    } = req.body;

    if (!name || !email || !itemName || !description || !location || !date || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // 🔍 Step 1: Find or create user
    let user_id;
    const [userRows] = await pool.query("SELECT user_id FROM users WHERE tu_email = ?", [email]);

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

    // 🔍 Step 2: Look up building_id by location name
    let building_id = null;
    const [buildingRows] = await pool.query(
      `SELECT building_id FROM buildings WHERE LOWER(name) = ? LIMIT 1`,
      [location.toLowerCase()]
    );
    if (buildingRows.length > 0) {
      building_id = buildingRows[0].building_id;
    }

    // ✅ Step 3: Insert item into items table
    const [result] = await pool.query(
      `INSERT INTO items 
       (user_id, type, title, category, color, brand, description, building_id, date_lost, 
        drop_off_location, preferred_contact_method, allow_contact, verification_tip, 
        photo_base64, is_returned, is_high_value, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        clean(type),
        clean(itemName),
        clean(category),
        Array.isArray(colors) && colors.length ? colors.join(", ") : null,
        clean(brand),
        clean(description),
        building_id,
        clean(date),
        clean(dropoff),
        clean(contactMethod),
        canContact ? 1 : 0,
        clean(verificationTip),
        clean(photo_base64),
        0, // is_returned
        0, // is_high_value
        new Date() // created_at
      ]
    );

    console.log(`✅ Inserted item ID ${result.insertId} for user ID ${user_id}`);
    res.status(201).json({ success: true, item_id: result.insertId });

  } catch (error) {
    console.error("❌ Error inserting item:", error);
    res.status(500).json({ success: false, message: "Error inserting item", error: error.message });
  }
});

// GET /api/items — Retrieve lost/found items (supports ?type=lost&location=XYZ)
router.get("/", async (req, res) => {
  try {
    const { location, type } = req.query;

    let whereClauses = ["i.is_returned = 0"];
    let values = [];

    if (location) {
      whereClauses.push(`
        (
          LOWER(b.name) LIKE ? OR
          LOWER(b.slug) = ? OR
          LOWER(i.location_lost) LIKE ?
        )
      `);
      values.push(`%${location.toLowerCase()}%`);
      values.push(location.toLowerCase());
      values.push(`%${location.toLowerCase()}%`);
    }

    if (type === "lost" || type === "found") {
      whereClauses.push("i.type = ?");
      values.push(type);
    }

    const whereSQL = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const [items] = await pool.query(
      `SELECT 
         i.id,
         i.type,
         i.title AS name,
         i.category,
         i.color,
         COALESCE(b.name, i.location_lost) AS location,
         i.date_lost AS date,
         i.description,
         i.photo_base64 AS image,
         i.preferred_contact_method AS contact
       FROM items i
       LEFT JOIN buildings b ON i.building_id = b.building_id
       ${whereSQL}
       ORDER BY i.date_lost DESC
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
  }
});

// GET /api/items/:id — Get single item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
         i.id,
         i.type,
         i.title AS name,
         i.category,
         COALESCE(b.name, i.location_lost) AS location,
         i.date_lost AS date,
         i.description,
         i.photo_base64 AS image,
         i.preferred_contact_method AS contact
       FROM items i
       LEFT JOIN buildings b ON i.building_id = b.building_id
       WHERE i.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, item: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching item by ID:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// POST /api/items/:id/claim — Mark item as claimed
router.post("/:id/claim", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE items SET is_returned = 1 WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item marked as returned" });
  } catch (err) {
    console.error("❌ Error marking item as returned:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/verify-claim — handle item claim verification
router.post("/verify-claim", async (req, res) => {
  const { itemId, name, email, details } = req.body;

  if (!itemId || !name || !email || !details) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO messages (item_id, sender_name, sender_email, message, type)
       VALUES (?, ?, ?, ?, ?)`,
      [itemId, name, email, details, "claim"]
    );

    await pool.query(`UPDATE items SET is_returned = 1 WHERE id = ?`, [itemId]);

    console.log(`✅ Claim verification submitted for item ${itemId}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error handling claim verification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/verify-found — handle item found confirmation
router.post("/verify-found", async (req, res) => {
  const { itemId, name, email, message } = req.body;

  if (!itemId || !name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO messages (item_id, sender_name, sender_email, message, type)
       VALUES (?, ?, ?, ?, ?)`,
      [itemId, name, email, message, "found"]
    );

    await pool.query(`UPDATE items SET is_returned = 1 WHERE id = ?`, [itemId]);

    console.log(`✅ Found verification submitted for item ${itemId}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error handling found verification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
