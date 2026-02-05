const AuditLog = require("../models/AuditLog");

module.exports = async (req, res, next) => {
  res.on("finish", async () => {
    if (!req.user) return;

    await AuditLog.create({
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      UserId: req.user.id,
    });
  });

  next();
};