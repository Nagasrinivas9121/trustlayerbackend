require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./config/db");

const { apiLimiter } = require("./middleware/rateLimit");
const audit = require("./middleware/audit");

const app = express();

/* ==========================================
   TRUST PROXY (Render / Vercel compatibility)
========================================== */
app.set("trust proxy", 1);

/* ==========================================
   SECURITY
========================================== */

app.use(helmet());

app.use(
  cors({
    origin: [
      "https://trustlayerlabs.vercel.app",
      "https://trustlayerlabs.co.in",
      "https://www.trustlayerlabs.co.in",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  })
);

/* ==========================================
   PARSING
========================================== */

app.use(express.json({ limit: "10kb" }));

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ==========================================
   RATE LIMIT
========================================== */

app.use("/api/", apiLimiter);

/* ==========================================
   AUDIT LOG (optional)
========================================== */

app.use("/api/services", audit);
app.use("/api/contact", audit);

/* ==========================================
   ROUTES
========================================== */

app.use("/api/services", require("./routes/service.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

/* ==========================================
   HEALTH CHECK
========================================== */

app.get("/", (req, res) => {
  res.status(200).send("TrustLayerLabs API running");
});

/* ==========================================
   START SERVER
========================================== */

const PORT = process.env.PORT || 5000;

(async () => {
  try {

    await sequelize.authenticate();

    console.log("Database connected");


    await sequelize.sync();

    console.log("Models synced");


    app.listen(PORT, () => {

      console.log(`Server running on ${PORT}`);

    });

  } catch (err) {

    console.error(err);

  }

})();