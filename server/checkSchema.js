const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
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

    console.log(`\n📋 Tables and Columns in ${process.env.DB_NAME}:\n`);

    for (const row of tables) {
      const tableName = row[tableKey];
      console.log(`🗂️ ${tableName}`);

      const [columns] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})${col.Null === 'NO' ? ' NOT NULL' : ''}`);
      });

      console.log(); // newline between tables
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error checking schema:", error.message);
  }
}

checkSchema();
