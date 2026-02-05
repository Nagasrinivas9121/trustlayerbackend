const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const User = require("../models/User");
const Course = require("../models/Course");
const ServiceRequest = require("../models/ServiceRequest");

const router = express.Router();

/* ================= USERS ================= */

// Get all users
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email", "role", "createdAt"],
  });
  res.json(users);
});

// Update user role
router.put("/users/:id/role", auth, admin, async (req, res) => {
  const { role } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  await user.save();

  res.json({ success: true });
});

/* ================= COURSES ================= */

// Add course
router.post("/courses", auth, admin, async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

// Delete course
router.delete("/courses/:id", auth, admin, async (req, res) => {
  await Course.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

/* ================= SERVICES ================= */

// View service requests
router.get("/services", auth, admin, async (req, res) => {
  const services = await ServiceRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(services);
});

// Update service status
router.put("/services/:id", auth, admin, async (req, res) => {
  const service = await ServiceRequest.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  service.status = req.body.status;
  await service.save();

  res.json({ success: true });
});

module.exports = router;