const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");
const Payment = require("./Payment");

/* ================= ENROLLMENTS ================= */

// Many Users ↔ Many Courses
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

// Explicit relations
Enrollment.belongsTo(User, { onDelete: "CASCADE" });
Enrollment.belongsTo(Course, { onDelete: "CASCADE" });

User.hasMany(Enrollment, { onDelete: "CASCADE" });
Course.hasMany(Enrollment, { onDelete: "CASCADE" });

/* ================= PAYMENTS ================= */

// User → Payments
User.hasMany(Payment, { onDelete: "CASCADE" });
Payment.belongsTo(User);

// Course → Payments
Course.hasMany(Payment, { onDelete: "CASCADE" });
Payment.belongsTo(Course);

// Enrollment → Payment (1:1)
Enrollment.hasOne(Payment, { onDelete: "CASCADE" });
Payment.belongsTo(Enrollment);

/* ================= SERVICE REQUESTS ================= */

// User → Service Requests
User.hasMany(ServiceRequest, { onDelete: "CASCADE" });
ServiceRequest.belongsTo(User);

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
  Payment,
};