const express = require("express");
const auth = require("../middleware/auth");
const { Course, User, Enrollment } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

/* ================= GET ENROLLED COURSES (ACTIVE ONLY) ================= */
router.get("/", auth, async (req, res) => {
  try {
    const now = new Date();

    const courses = await Course.findAll({
      include: {
        model: User,
        where: { id: req.user.id },
        through: {
          model: Enrollment,
          attributes: ["progress", "expiresAt"],
          where: {
            expiresAt: {
              [Op.gt]: now, // 🔐 BLOCK EXPIRED COURSES
            },
          },
        },
      },
    });

    res.json(courses);
  } catch (err) {
    console.error("Enrollment fetch error:", err);
    res.status(500).json({ message: "Failed to load enrollments" });
  }
});

module.exports = router;