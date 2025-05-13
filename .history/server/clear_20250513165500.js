const mysql = require("mysql2/promise");
require("dotenv").config();

async function clearDatabaseExceptUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    const tablesToDeleteInOrder = [
      "messages",             // depends on items
      "items",                // depends on users, buildings
      "email_verifications",  // depends on users
      "buildings"
    ];

    console.log(`\n🧹 Clearing tables in dependency-safe order...\n`);

    for (const table of tablesToDeleteInOrder) {
      await connection.query(`DELETE FROM \`${table}\``);
      console.log(`✅ Cleared table: ${table}`);
    }

    await connection.end();
    console.log("\n🎉 All relevant tables cleared (users preserved).");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
  }
}

clearDatabaseExceptUsers();
