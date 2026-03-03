const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },

    // ✅ NULL-safe to prevent 500 errors
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["UserId"] },
      { fields: ["CourseId"] },
    ],
  }
);

module.exports = Enrollment;