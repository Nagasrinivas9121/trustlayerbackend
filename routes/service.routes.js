const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  res.json(await ServiceRequest.create({
    service: req.body.service,
    description: req.body.description,
    UserId: req.user.id,
  }));
});

router.get("/", auth, async (req, res) => {
  res.json(await ServiceRequest.findAll({
    where: { UserId: req.user.id },
  }));
});

module.exports = router;