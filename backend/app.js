require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? origin.replace(/\/+$/, "") : origin;
      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure database connection per request in serverless mode
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trust Elara API is running",
  });
});

// API routes
app.use("/api/admin", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);

// Start server after database connection when run directly
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
