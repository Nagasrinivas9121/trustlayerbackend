const express = require("express");
const auth = require("../middleware/auth");
const { Enrollment, Course } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

/* =====================================================
   GET ENROLLED COURSES (ACTIVE ONLY)
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const now = new Date();

    const enrollments = await Enrollment.findAll({
      where: {
        UserId: req.user.id,
        expiresAt: {
          [Op.gt]: now, // 🔒 block expired access
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

    return res.json(enrollments);
  } catch (err) {
    console.error("ENROLLMENT FETCH ERROR:", err);
    return res.status(500).json({
      message: "Failed to load enrollments",
    });
  }
});

module.exports = router;