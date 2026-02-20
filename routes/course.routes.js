const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ============================================================
   GET ALL COURSES (PUBLIC) ✅ DB-SAFE
============================================================ */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(courses);
  } catch (error) {
    console.error("FETCH COURSES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
});

/* ============================================================
   ADD COURSE (ADMIN ONLY)
============================================================ */
router.post("/", auth, admin, async (req, res) => {
  try {
    const { title, price, driveLink } = req.body;

    if (!title || !price || !driveLink) {
      return res.status(400).json({
        message: "Title, price and drive link are required",
      });
    }

    const course = await Course.create({
      title,
      price,
      driveLink,
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({ message: "Failed to create course" });
  }
});

/* ============================================================
   GET COURSE CONTENT (ENROLLED USERS ONLY)
============================================================ */
router.get("/:id/content", auth, async (req, res) => {
  try {
    const course = await Course.scope("withDriveLink").findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({
      id: course.id,
      title: course.title,
      driveLink: course.driveLink,
    });
  } catch (error) {
    console.error("FETCH COURSE CONTENT ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch course content" });
  }
});

module.exports = router;