const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("created", "success", "failed"),
    defaultValue: "created",
  },
});

module.exports = Payment;