const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function showAllTableContents() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [tables] = await connection.query("SHOW TABLES");
    const tableKey = `Tables_in_${process.env.DB_NAME}`;

    console.log(`\n📦 Contents of All Tables in ${process.env.DB_NAME}:\n`);

    for (const row of tables) {
      const tableName = row[tableKey];
      console.log(`\n🗂️ Table: ${tableName}`);

      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);

      if (rows.length === 0) {
        console.log("  (No data)");
      } else {
        rows.forEach((row, i) => {
          console.log(`  Row ${i + 1}:`);
          for (const [key, value] of Object.entries(row)) {
            const safeValue = value instanceof Date
              ? value.toISOString()
              : Buffer.isBuffer(value)
              ? value.toString('base64')
              : value;
            console.log(`    ${key}: ${safeValue}`);
          }
        });
      }
    }
  } catch (error) {
    console.error("❌ Error showing table contents:", error.message);
  } finally {
    if (connection) connection.release();
    await pool.end(); // optional: closes pool if script is one-time use
  }
}

showAllTableContents();
