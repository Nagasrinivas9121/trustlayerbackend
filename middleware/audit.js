const AuditLog = require("../models/AuditLog");

module.exports = async (req, res, next) => {

  res.on("finish", async () => {

    try {

      await AuditLog.create({

        action: `${req.method} ${req.originalUrl}`,

        ip: req.ip,

        userAgent: req.headers["user-agent"],

        UserId: req.user ? req.user.id : null

      });

    } catch (err) {

      console.log("Audit log error:", err);

    }

  });

  next();

};