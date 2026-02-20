require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./config/db");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit");
const audit = require("./middleware/audit");

const app = express();

/* ================= PROXY (RENDER REQUIRED) ================= */
app.set("trust proxy", 1);

/* ================= GLOBAL MIDDLEWARE ================= */
app.use(helmet());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

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

    // 🚫 NEVER use alter:true in production
    await sequelize.sync();
    console.log("✅ Models synced");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    /* ================= GRACEFUL SHUTDOWN ================= */
    process.on("SIGTERM", async () => {
      console.log("🛑 SIGTERM received. Closing server...");
      server.close();
      await sequelize.close();
      process.exit(0);
    });

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();