const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE SERVICE REQUEST */
router.post("/", auth, async (req, res) => {
  try {
    const { service, description } = req.body;

    if (!service || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const request = await ServiceRequest.create({
      service,
      description,
      requesterEmail: req.user.email, // ✅ EMAIL STORED
      UserId: req.user.id,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* USER – VIEW OWN REQUESTS */
router.get("/", auth, async (req, res) => {
  const requests = await ServiceRequest.findAll({
    where: { UserId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json(requests);
});

module.exports = router;