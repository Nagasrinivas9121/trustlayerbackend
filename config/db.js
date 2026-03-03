const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",

  logging: false, // ✅ keep false in production

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  timezone: "+05:30", // ✅ safe (IST)

  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false } // ✅ REQUIRED on Render
        : false,
  },

  // ✅ Optional (not required, but safe)
  define: {
    freezeTableName: false,
  },
});

module.exports = sequelize;