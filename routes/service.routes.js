const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= CREATE SERVICE REQUEST ================= */

router.post("/", auth, async (req, res) => {
  try {
    const { service, description } = req.body;

    if (!service || !description) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const request = await ServiceRequest.create({
      service,
      description,
      requesterEmail: req.user.email, // ✅ EMAIL STORED & VISIBLE TO ADMIN
      UserId: req.user.id,
    });

    return res.status(201).json(request);
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

/* ================= USER: VIEW OWN REQUESTS ================= */

router.get("/", auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json(requests);
  } catch (err) {
    console.error("FETCH USER SERVICES ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch service requests",
    });
  }
});

module.exports = router;