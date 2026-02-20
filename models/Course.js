const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    originalPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // 🔒 Never expose publicly – only via /courses/:id/content
    driveLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    expiryDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    difficulty: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
      defaultValue: "Beginner",
    },

    highlights: {
      type: DataTypes.TEXT, // comma-separated or bullet-style features
      allowNull: true,
    },
  },
  {
    timestamps: true,

    // 🔐 Extra safety: hide driveLink unless explicitly requested
    defaultScope: {
      attributes: { exclude: ["driveLink"] },
    },

    scopes: {
      withDriveLink: {
        attributes: { include: ["driveLink"] },
      },
    },
  }
);

module.exports = Course;