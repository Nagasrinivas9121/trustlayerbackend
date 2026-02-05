const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceRequest = sequelize.define("ServiceRequest", {
  service: DataTypes.STRING,
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

module.exports = ServiceRequest;