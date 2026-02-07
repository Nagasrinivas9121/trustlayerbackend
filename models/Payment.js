const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define(
  "Payment",
  {
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // razorpay_payment_id
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false, // razorpay_order_id
    },
    amount: {
      type: DataTypes.INTEGER, // amount in PAISA
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
    status: {
      type: DataTypes.ENUM("created", "success", "failed"),
      defaultValue: "created",
    },
    method: {
      type: DataTypes.STRING, // card / upi / netbanking
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["paymentId"] },
      { fields: ["orderId"] },
      { fields: ["status"] },
    ],
  }
);

module.exports = Payment;