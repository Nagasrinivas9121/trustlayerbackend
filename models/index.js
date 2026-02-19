const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");
const Payment = require("./Payment");

/* ================= ENROLLMENTS ================= */

// Many Users ↔ Many Courses
User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

// Explicit relations (important for includes)
Enrollment.belongsTo(User);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Course.hasMany(Enrollment);

/* ================= PAYMENTS ================= */

// One User → Many Payments
User.hasMany(Payment);
Payment.belongsTo(User);

// One Course → Many Payments
Course.hasMany(Payment);
Payment.belongsTo(Course);

// One Enrollment → One Payment (best practice)
Enrollment.hasOne(Payment);
Payment.belongsTo(Enrollment);

/* ================= SERVICE REQUESTS ================= */

// One User → Many Service Requests
User.hasMany(ServiceRequest);
ServiceRequest.belongsTo(User);

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
  Payment,
};