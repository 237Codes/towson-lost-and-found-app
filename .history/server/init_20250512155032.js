const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

async function initializeLocalDB() {
  const sqlPath = path.join(__dirname, "dbschema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL, // full PostgreSQL URL from Render
    ssl: {
      rejectUnauthorized: false, // required for most cloud providers like Render
    },
  });

  try {
    await client.connect();
    console.log("🚀 Connected to PostgreSQL. Executing schema...");

    await client.query(sql); // executes entire file (can include multiple CREATE statements)

    console.log("✅ Local PostgreSQL database initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize PostgreSQL DB:", error.message);
  } finally {
    await client.end();
  }
}

initializeLocalDB();
