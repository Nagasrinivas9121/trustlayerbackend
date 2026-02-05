/**
 * Admin-only access middleware
 * Requires auth middleware to run before this
 */

module.exports = (req, res, next) => {
  try {
    // Safety check: auth middleware must attach user
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Role check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    // User is admin → allow request
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Admin authorization failed",
    });
  }
};