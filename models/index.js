const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");
const Payment = require("./Payment");

/* ================= ENROLLMENTS ================= */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

Enrollment.belongsTo(User);
Enrollment.belongsTo(Course);
User.hasMany(Enrollment);
Course.hasMany(Enrollment);

/* ================= PAYMENTS ================= */

User.hasMany(Payment);
Payment.belongsTo(User);

Course.hasMany(Payment);
Payment.belongsTo(Course);

Enrollment.hasOne(Payment);
Payment.belongsTo(Enrollment);

/* ================= SERVICES ================= */

User.hasMany(ServiceRequest);
ServiceRequest.belongsTo(User);

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
  Payment,
};