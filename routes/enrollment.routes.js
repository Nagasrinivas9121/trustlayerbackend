const express = require("express");
const auth = require("../middleware/auth");
const { Course, Enrollment } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

/* ================= GET ENROLLED COURSES (ACTIVE ONLY) ================= */
router.get("/", auth, async (req, res) => {
  try {
    const now = new Date();

    const enrollments = await Enrollment.findAll({
      where: {
        UserId: req.user.id,
        expiresAt: {
          [Op.gt]: now, // 🔐 block expired access
        },
      },
      include: [
        {
          model: Course,
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
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(enrollments);
  } catch (err) {
    console.error("ENROLLMENT FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load enrollments" });
  }
});

module.exports = router;