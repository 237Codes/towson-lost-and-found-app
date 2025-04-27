const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {testConnection} = require("./db");
const userRoutes = require("./routes/user");
const dbTestingRoutes = require("./routes/db_testing");
const authRoutes = require("./routes/auth");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes

app.use("/api/users", userRoutes);  // mount user registration routes
app.use("/api/db", dbTestingRoutes); // mount db testing routes
app.use("/api/auth", authRoutes); // mount authentication routes


const PORT = 3001;  // Port for the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Test database connection on startup
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('Database connection verified');
  } else {
    console.log('Could not verify database connection');
  }
});
