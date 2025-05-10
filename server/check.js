const mysql = require('mysql2/promise');
require('dotenv').config();

async function inspectImageData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    const [rows] = await connection.query(
      "SELECT LENGTH(photo_base64) AS length, LEFT(photo_base64, 50) AS preview FROM items WHERE title = ?",
      ['Cow']
    );

    if (rows.length > 0) {
      console.log("\n📏 Stored base64 length:", rows[0].length);
      console.log("🔍 First 50 characters:\n", rows[0].preview);
    } else {
      console.log("❌ No item found with title 'Cactus'");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error inspecting image data:", error.message);
  }
}

inspectImageData();
