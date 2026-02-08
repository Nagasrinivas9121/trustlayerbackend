const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* UPDATE PROFILE */
router.put("/profile", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.update(req.body);

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    college: user.college,
    course: user.course,
    year: user.year,
    phone: user.phone,
    city: user.city,
  });
});

module.exports = router;