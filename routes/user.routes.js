const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Update profile
router.put("/profile", auth, async (req, res) => {
  await User.update(req.body, {
    where: { id: req.user.id },
  });

  const updatedUser = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  res.json(updatedUser);
});

module.exports = router;