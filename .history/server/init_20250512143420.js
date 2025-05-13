const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function initializeLocalDB() {
  const sqlPath = path.join(__dirname, "dbschema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    console.log("🚀 Connected to MySQL. Executing schema...");
    await connection.query(sql);
    console.log("✅ Local database initialized successfully.");
    await connection.end();
  } catch (error) {
    console.error("❌ Failed to initialize local DB:", error.message);
  }
}

initializeLocalDB();
