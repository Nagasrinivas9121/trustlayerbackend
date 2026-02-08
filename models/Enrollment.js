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
    allowNull: true,          // ✅ MUST BE TRUE
  },
});

/* ================= RELATIONS ================= */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

Enrollment.belongsTo(User);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Course.hasMany(Enrollment);

module.exports = Enrollment;