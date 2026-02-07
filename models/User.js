const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "student",
  },

  name: DataTypes.STRING,
  college: DataTypes.STRING,
  course: DataTypes.STRING,
  year: DataTypes.STRING,
  phone: DataTypes.STRING,
  city: DataTypes.STRING,
});

module.exports = User;