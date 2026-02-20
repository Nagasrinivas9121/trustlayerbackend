const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");
const Payment = require("./Payment");

/* ================= ENROLLMENTS ================= */

// Many Users ↔ Many Courses (JOIN TABLE)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "UserId",
  otherKey: "CourseId",
});

Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "CourseId",
  otherKey: "UserId",
});

/* 🔑 REQUIRED FOR include() TO WORK */
Enrollment.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Enrollment.belongsTo(Course, {
  foreignKey: "CourseId",
  onDelete: "CASCADE",
});

User.hasMany(Enrollment, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Course.hasMany(Enrollment, {
  foreignKey: "CourseId",
  onDelete: "CASCADE",
});

/* ================= PAYMENTS ================= */

User.hasMany(Payment, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});
Payment.belongsTo(User, { foreignKey: "UserId" });

Course.hasMany(Payment, {
  foreignKey: "CourseId",
  onDelete: "CASCADE",
});
Payment.belongsTo(Course, { foreignKey: "CourseId" });

Enrollment.hasOne(Payment, {
  foreignKey: "EnrollmentId",
  onDelete: "CASCADE",
});
Payment.belongsTo(Enrollment, { foreignKey: "EnrollmentId" });

/* ================= SERVICE REQUESTS ================= */

User.hasMany(ServiceRequest, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});
ServiceRequest.belongsTo(User, { foreignKey: "UserId" });

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
  Payment,
};