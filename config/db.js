const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",

  logging: false, // disable SQL logs (important for speed)

  pool: {
    max: 10,        // max DB connections
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  dialectOptions: {
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  },
});

module.exports = sequelize;