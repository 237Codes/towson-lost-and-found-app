const mysql = require("mysql2/promise");

async function initializeDatabase() {
  const DB_NAME = "lost_and_found_dev";

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root", // change if using a different dev user
    password: "", // update to match your local password
    multipleStatements: true,
  });

  try {
    console.log("🛠️ Creating database and tables...");

    await connection.query(`
      DROP DATABASE IF EXISTS \`${DB_NAME}\`;
      CREATE DATABASE \`${DB_NAME}\`;
      USE \`${DB_NAME}\`;

      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        tu_email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        password_hash VARCHAR(255),
        role ENUM('student', 'admin') DEFAULT 'student',
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('lost', 'found') NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        color VARCHAR(255),
        brand VARCHAR(100),
        description TEXT,
        location_lost VARCHAR(100),
        date_lost DATE,
        drop_off_location VARCHAR(100),
        preferred_contact_method ENUM('Email', 'Phone') DEFAULT 'Email',
        allow_contact BOOLEAN DEFAULT TRUE,
        verification_tip VARCHAR(255),
        is_returned BOOLEAN DEFAULT FALSE,
        is_high_value BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Database and tables created successfully.");
  } catch (err) {
    console.error("❌ Error creating schema:", err.message);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
