const User = require("./User");
const Project = require("./Project");

User.hasMany(Project, { foreignKey: "ownerId" });
Project.belongsTo(User, { foreignKey: "ownerId" });

module.exports = { User, Project };