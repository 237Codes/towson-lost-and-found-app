const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./db");

// Route imports
const userRoutes = require("./routes/user");
const dbTestingRoutes = require("./routes/db_testing");
const authRoutes = require("./routes/auth");
const itemsRoutes = require("./routes/items");
const contactRoutes = require("./routes/contact");
app.use("/api/contact", contactRoutes);


const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/users", userRoutes);         // User registration routes
app.use("/api/db", dbTestingRoutes);       // DB testing routes
app.use("/api/auth", authRoutes);          // Auth routes
app.use("/api/items", itemsRoutes);        // Mount items route

// Optional logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Start server
const PORT = 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  const isConnected = await testConnection();
  if (isConnected) {
    console.log("Database connection verified");
  } else {
    console.log("Could not verify database connection");
  }
});
