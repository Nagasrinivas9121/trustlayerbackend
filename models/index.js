const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");
const Payment = require("./Payment");

/* ================= COURSE ENROLLMENTS ================= */

// Many Users ↔ Many Courses (via Enrollment)
User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

// Explicit relations (VERY IMPORTANT for queries)
Enrollment.belongsTo(User);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Course.hasMany(Enrollment);

/* ================= SERVICE REQUESTS ================= */

User.hasMany(ServiceRequest);
ServiceRequest.belongsTo(User);

/* ================= PAYMENTS ================= */

// One User → Many Payments
User.hasMany(Payment);
Payment.belongsTo(User);

// One Course → Many Payments
Course.hasMany(Payment);
Payment.belongsTo(Course);

// Optional: Link payment to enrollment (recommended)
Enrollment.hasOne(Payment);
Payment.belongsTo(Enrollment);

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
  Payment,
};