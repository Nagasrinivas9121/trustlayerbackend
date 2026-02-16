require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./config/db");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit");
const audit = require("./middleware/audit");

const app = express();

/* ================= GLOBAL MIDDLEWARE ================= */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

/* ================= RATE LIMITING ================= */
app.use("/api/", apiLimiter);
app.use("/api/auth", authLimiter);

/* ================= AUDIT LOGGING ================= */
app.use("/api/admin", audit);
app.use("/api/services", audit);
app.use("/api/enrollments", audit);

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/enrollments", require("./routes/enrollment.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/payment", require("./routes/payment.route"));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).send("✅ Trustlayer Labs API running");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // ✅ PRODUCTION SAFE
    await sequelize.sync();
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err);
    process.exit(1);
  }
})();