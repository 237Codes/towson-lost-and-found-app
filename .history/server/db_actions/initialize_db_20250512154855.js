const db = require("../db");

async function initializeUsersTable() {
  try {
    // Step 1: Create enum type if not exists
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('student', 'faculty', 'staff', 'admin');
        END IF;
      END
      $$;
    `);

    // Step 2: Create table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(35) NOT NULL,
        last_name VARCHAR(35) NOT NULL,
        tu_email VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        role user_role DEFAULT 'student',
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Step 3: Add optional index separately
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_email ON users(tu_email);
    `);

    console.log("✅ Users table created successfully (PostgreSQL)");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  initializeUsersTable()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { initializeUsersTable };
