const mysql = require("mysql2/promise");
require("dotenv").config();

const locations = [
  "Stephens Hall",
  "Science Complex",
  "Health Professions",
  "University Union",
  "Center For The Arts",
  "Liberal Arts Building",
  "York Rd",
  "Hawkins Hall",
  "Psychology Building",
  "Other"
];

async function seedBuildings() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
    });

    console.log(`🏗️ Inserting ${locations.length} buildings into '${process.env.DB_NAME}'...\n`);

    for (const name of locations) {
      const [rows] = await connection.query(
        `INSERT INTO buildings (name, description, address, phone_number, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [
          name,
          `Auto-generated record for ${name}`,
          "Towson University",
          "410-704-0000",
          `/images/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        ]
      );
      console.log(`✅ Inserted: ${name}`);
    }

    await connection.end();
    console.log("\n🎉 All buildings inserted successfully.");
  } catch (error) {
    console.error("❌ Erro
