const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Enrollment, Payment } = require("../models");
const auth = require("../middleware/auth");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", auth, async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });

  res.json(order);
});

// Verify payment
router.post("/verify", auth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // Save payment
  await Payment.create({
    paymentId: razorpay_payment_id,
    amount: 0,
    status: "success",
  });

  // Auto enroll
  await Enrollment.create({
    userId: req.user.id,
    courseId,
    status: "paid",
    progress: 0,
  });

  res.json({ success: true });
});

module.exports = router;