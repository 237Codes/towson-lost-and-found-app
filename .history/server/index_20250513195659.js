const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./db");

const app = express();

// --------------------
// ✅ CORS Configuration
// --------------------
const allowedOrigins = [
  "http://localhost:3000", // dev
  "https://towson-lost-and-found-app.onrender.com", // frontend on Render
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// --------------------
// ✅ Middleware
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Optional: Log every request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// --------------------
// ✅ Route Handlers
// --------------------
app.use("/api/users", require("./routes/user"));
app.use("/api/db", require("./routes/db_testing"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/items", require("./routes/items"));
app.use("/api/contact", require("./routes/contact"));

// --------------------
// ❌ 404 Fallback
// --------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// --------------------
// 🚀 Start Server
// --------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  const isConnected = await testConnection();
  if (isConnected) {
    console.log("✅ Database connection verified");
  } else {
    console.log("❌ Could not verify database connection");
  }
});
