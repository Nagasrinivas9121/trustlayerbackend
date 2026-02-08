const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Course = sequelize.define("Course", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driveLink: {
    type: DataTypes.TEXT,
    allowNull: false, // Google Drive link
  },
});

module.exports = Course;