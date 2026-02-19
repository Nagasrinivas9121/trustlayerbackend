const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceRequest = sequelize.define(
  "ServiceRequest",
  {
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    requesterEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "quoted", "completed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ServiceRequest;