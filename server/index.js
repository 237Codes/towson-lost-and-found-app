const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const userRoutes = require("./routes/user");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Test database connection route
app.get("/api/test", async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release(); // Important: release the connection back to the pool

    res.json({
      message: "Database connection successful",
      connected: true,
    });
  } catch (error) {
    console.error("Connection error details:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      connected: false,
    });
  }
});

// routes
app.use("/api/users", userRoutes);
// Basic user registration route


const PORT = 3001;  // Port for the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
