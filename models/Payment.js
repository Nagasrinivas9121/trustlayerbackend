const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define(
  "Payment",
  {
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,          // Razorpay payment id
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,      // Razorpay order id
    },
    amount: {
      type: DataTypes.INTEGER, // Amount in INR
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("created", "success", "failed"),
      defaultValue: "created",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Payment;