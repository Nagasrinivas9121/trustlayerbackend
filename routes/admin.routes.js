const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const User = require("../models/User");
const Course = require("../models/Course");
const ServiceRequest = require("../models/ServiceRequest");
const Payment = require("../models/Payment");

const router = express.Router();

/* ================= USERS ================= */

router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "email",
        "role",
        "college",
        "year",
        "phone",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(users);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/users/:id/role", auth, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    return res.status(500).json({ message: "Failed to update role" });
  }
});

/* ================= COURSES ================= */
/* ✅ FINAL FIX: description + all fields explicitly mapped */

router.post("/courses", auth, admin, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      driveLink,
      expiryDays,
      difficulty,
      highlights,
    } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        message: "Title, description and price are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      price,
      originalPrice,
      driveLink,
      expiryDays,
      difficulty,
      highlights,
    });

    return res.status(201).json(course);
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    return res.status(500).json({ message: "Failed to create course" });
  }
});

router.delete("/courses/:id", auth, admin, async (req, res) => {
  try {
    await Course.destroy({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE COURSE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete course" });
  }
});

/* ================= SERVICES ================= */

router.get("/services", auth, admin, async (req, res) => {
  try {
    const services = await ServiceRequest.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(services);
  } catch (err) {
    console.error("ADMIN SERVICES ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch services" });
  }
});

router.put("/services/:id", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "quoted", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const service = await ServiceRequest.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = status;
    await service.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    return res.status(500).json({ message: "Failed to update service" });
  }
});

/* ================= PAYMENTS ================= */

router.get("/payments", auth, admin, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(payments);
  } catch (err) {
    console.error("ADMIN PAYMENTS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
});

module.exports = router;