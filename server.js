require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./config/db");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit");
const audit = require("./middleware/audit");

// ================= INIT APP =================
const app = express();

// ================= TRUST PROXY =================
app.set("trust proxy", 1);

// ================= SECURITY MIDDLEWARE =================
app.use(helmet());

app.use(
  cors({
    origin: [
      "https://trustlayerlabs.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Razorpay webhook (raw body)
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// JSON parser
app.use(express.json({ limit: "10kb" }));

app.use(morgan("combined"));

// ================= RATE LIMITING =================
app.use("/api/", apiLimiter);
app.use("/api/auth", authLimiter);

// ================= AUDIT LOGGING =================
app.use("/api/admin", audit);
app.use("/api/services", audit);
app.use("/api/enrollments", audit);

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/enrollments", require("./routes/enrollment.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/payment", require("./routes/payment.route"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("✅ Trustlayer Labs API running");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Trustlayer Labs backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
})();