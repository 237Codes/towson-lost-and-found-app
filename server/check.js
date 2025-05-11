const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkColorValues() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    const [rows] = await connection.query(`
      SELECT DISTINCT color FROM items WHERE color IS NOT NULL AND color != ''
    `);

    console.log("🎨 Distinct color values found in 'items' table:");
    rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.color}`);
    });

    await connection.end();
  } catch (error) {
    console.error("❌ Error fetching color values:", error.message);
  }
}

checkColorValues();
