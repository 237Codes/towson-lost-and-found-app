const mysql = require('mysql2/promise');
require('dotenv').config();

async function listBuildings() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    const [rows] = await connection.query("SELECT * FROM buildings");

    console.log(`\n🏛️ Buildings in ${process.env.DB_NAME}:\n`);
    if (rows.length === 0) {
      console.log("No buildings found.");
    } else {
      rows.forEach((row, index) => {
        console.log(`🔹 Building ${index + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
        console.log(); // newline between buildings
      });
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error retrieving buildings:", error.message);
  }
}

listBuildings();
