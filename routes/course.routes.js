const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// ✅ ADD COURSE (ADMIN – for now open, admin check later)
router.post("/", async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price required" });
    }

    const course = await Course.create({ title, price });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
});

module.exports = router;