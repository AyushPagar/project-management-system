const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Project = sequelize.define("Project", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT
});

module.exports = Project;