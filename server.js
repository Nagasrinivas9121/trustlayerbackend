require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for rate limiter (useful when hosted on Render behind a proxy)
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet());

// 1. Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// 2. CORS Configuration
app.use(cors({
  origin: "*"
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use("/api/", apiLimiter);

// 3. API Routes

// Root Route to confirm API is running and fix "Not Found /" error
app.get("/", (req, res) => {
  res.send("TrustLayer Labs API running");
});

// Favicon handler to prevent browser console error
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "TrustLayer Labs API"
  });
});

// Form Endpoints
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/quote", require("./routes/quoteRoutes"));
app.use("/api/scan", require("./routes/scanRoutes"));

// 4. Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});