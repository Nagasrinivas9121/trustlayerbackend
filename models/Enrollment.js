const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Course = require("./Course");

const Enrollment = sequelize.define("Enrollment", {
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

/* ================= RELATIONS ================= */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

module.exports = Enrollment;