const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const AuditLog = sequelize.define("AuditLog", {

action: {

type: DataTypes.STRING,

allowNull: false

},

ip: {

type: DataTypes.STRING

},

userAgent: {

type: DataTypes.STRING

},

UserId: {

type: DataTypes.INTEGER,

allowNull: true

}

});

module.exports = AuditLog;