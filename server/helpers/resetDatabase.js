const mysql = require("mysql2/promise");
require("dotenv").config();

async function resetDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
      multipleStatements: true,
    });

    console.log(`\n⚠️ Dropping all tables in ${process.env.DB_NAME}...`);
    const [tables] = await connection.query("SHOW TABLES");
    const tableKey = `Tables_in_${process.env.DB_NAME}`;

    for (const row of tables) {
      const tableName = row[tableKey];
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`✅ Dropped: ${tableName}`);
    }

    console.log("\n🚧 Rebuilding schema...\n");

    const schemaSQL = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(35) NOT NULL,
      last_name VARCHAR(35) NOT NULL,
      tu_email VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      phone_number VARCHAR(20),
      role ENUM('student', 'faculty', 'staff', 'admin') DEFAULT 'student',
      points INT DEFAULT 0,
      is_email_verified BOOLEAN DEFAULT FALSE,
      email_verified_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (tu_email)
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      session_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      session_token VARCHAR(255) NOT NULL UNIQUE,
      ip_address VARCHAR(45),
      user_agent VARCHAR(255),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      INDEX idx_session_token (session_token)
    );

    CREATE TABLE IF NOT EXISTS email_verifications (
      verification_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      verification_token VARCHAR(255) NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      INDEX idx_verification_token (verification_token)
    );

    CREATE TABLE IF NOT EXISTS buildings (
      building_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      address VARCHAR(255),
      phone_number VARCHAR(20),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      building_id INT,
      type ENUM('lost', 'found') NOT NULL,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      color TEXT,
      brand VARCHAR(100),
      description TEXT NOT NULL,
      location_lost VARCHAR(255),
      date_lost DATE NOT NULL,
      drop_off_location VARCHAR(255),
      preferred_contact_method ENUM('Email', 'Phone') DEFAULT 'Email',
      allow_contact BOOLEAN DEFAULT FALSE,
      verification_tip TEXT,
      photo_base64 LONGTEXT,
      is_returned BOOLEAN DEFAULT FALSE,
      is_high_value BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (building_id) REFERENCES buildings(building_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      item_id INT NOT NULL,
      sender_name VARCHAR(100) NOT NULL,
      sender_email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('claim', 'found') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id)
    );
    `;

    await connection.query(schemaSQL);
    console.log("✅ Database schema has been reset successfully!");

    await connection.end();
  } catch (error) {
    console.error("❌ Error resetting database:", error.message);
  }
}

resetDatabase();
