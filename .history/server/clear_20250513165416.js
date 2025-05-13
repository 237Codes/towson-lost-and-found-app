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

    const [tables] = await connection.query("SHOW TABLES");
    const tableKey = `Tables_in_${process.env.DB_NAME}`;

    console.log(`\n🧹 Clearing data from ${tables.length - 1} tables (excluding 'users'):\n`);

    for (const row of tables) {
      const tableName = row[tableKey];

      if (tableName !== "users") {
        await connection.query(`DELETE FROM \`${tableName}\``);
        console.log(`✅ Cleared table: ${tableName}`);
      }
    }

    await connection.end();
    console.log("\n🎉 Database cleanup complete.");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
  }
}

clearDatabaseExceptUsers();
