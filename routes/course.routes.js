const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ================= GET ALL COURSES (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: ["id", "title", "price"], // ❌ never expose driveLink publicly
    });

    res.json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= ADD COURSE (ADMIN ONLY) ================= */
router.post("/", auth, admin, async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price required" });
    }

    const course = await Course.create({
      title,
      price,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
});

/* ================= UPDATE DRIVE LINK (ADMIN ONLY) ================= */
router.put("/:id/drive-link", auth, admin, async (req, res) => {
  try {
    const { driveLink } = req.body;

    if (!driveLink) {
      return res.status(400).json({ message: "Drive link required" });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.driveLink = driveLink;
    await course.save();

    res.json({ message: "Drive link updated successfully" });
  } catch (error) {
    console.error("Update drive link error:", error);
    res.status(500).json({ message: "Failed to update drive link" });
  }
});

/* ================= DELETE COURSE (ADMIN ONLY) ================= */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

module.exports = router;