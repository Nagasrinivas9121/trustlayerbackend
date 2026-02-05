const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AuditLog = sequelize.define("AuditLog", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ip: DataTypes.STRING,
  userAgent: DataTypes.STRING,
});

module.exports = AuditLog;