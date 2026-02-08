const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Enrollment = sequelize.define("Enrollment", {
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => {
      const date = new Date();
      date.setMonth(date.getMonth() + 6); // ✅ 6 months access
      return date;
    },
  },
});

module.exports = Enrollment;