const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");


const ServiceRequest = sequelize.define("ServiceRequest", {

 service: {

   type: DataTypes.STRING,

   allowNull: false

 },

 requesterEmail: {

   type: DataTypes.STRING,

   allowNull: false

 },

 description: {

   type: DataTypes.TEXT,

   allowNull: false

 }

});


module.exports = ServiceRequest;