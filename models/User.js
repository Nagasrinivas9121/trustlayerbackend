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

  college: {
    type: DataTypes.STRING,
    allowNull: true, // ✅ IMPORTANT
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true, // ✅ IMPORTANT
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true, // ✅ IMPORTANT
  },
});