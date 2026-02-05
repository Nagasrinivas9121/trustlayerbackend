const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const ServiceRequest = require("./ServiceRequest");

/* ================= RELATIONSHIPS ================= */

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

User.hasMany(ServiceRequest);
ServiceRequest.belongsTo(User);

module.exports = {
  User,
  Course,
  Enrollment,
  ServiceRequest,
};