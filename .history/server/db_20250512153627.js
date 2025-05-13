const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection function
async function testConnection() {
  try {
    const { Pool } = require('pg');

    // Use the full connection string from Render
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL, // We'll define this in .env
      ssl: {
        rejectUnauthorized: false, // Needed for Render's SSL
      },
    });

    module.exports = { pool };

  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = {pool, testConnection};
