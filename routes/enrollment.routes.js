const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { Enrollment, Course } = require("../models");

/**
 * GET /api/enrollments
 * Get logged-in user's enrolled courses
 */
router.get("/", auth, async (req, res) => {
  try {
    const courses = await req.user.getCourses({
      through: { attributes: ["progress"] },
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

/**
 * POST /api/enrollments/:courseId
 * Enroll user in a course (used after payment later)
 */
router.post("/:courseId", auth, async (req, res) => {
  try {
    await req.user.addCourse(req.params.courseId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Enrollment failed" });
  }
});

module.exports = router;