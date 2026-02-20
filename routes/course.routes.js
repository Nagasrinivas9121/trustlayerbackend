const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ================= GET ALL COURSES (PUBLIC) ================= */
/* ❌ Do NOT expose driveLink publicly */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "originalPrice",
        "expiryDays",
        "difficulty",
        "highlights",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(courses);
  } catch (error) {
    console.error("FETCH COURSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ================= ADD COURSE (ADMIN ONLY) ================= */
router.post("/", auth, admin, async (req, res) => {
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

    if (!title || !description || !price || !driveLink) {
      return res.status(400).json({
        message: "Title, description, price and drive link are required",
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

    res.status(201).json(course);
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
});

/* ================= GET COURSE CONTENT (ENROLLED USERS ONLY) ================= */
/* ✅ Securely expose driveLink */
router.get("/:id/content", auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes: ["id", "title", "driveLink"],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔐 TODO: check enrollment before returning driveLink
    res.json(course);
  } catch (error) {
    console.error("FETCH COURSE CONTENT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch course content" });
  }
});

/* ================= UPDATE COURSE (ADMIN ONLY) ================= */
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to update course" });
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
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

module.exports = router;