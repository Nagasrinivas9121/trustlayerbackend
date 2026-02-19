/**
 * Admin-only access middleware
 * Must be used AFTER auth middleware
 */

module.exports = (req, res, next) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Ensure user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  // Authorized admin
  next();
};