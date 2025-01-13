const sequelize = require("../sequelize");
const tbl_search_history = require("./tbl_search_history");
const tbl_users = require("./tbl_users");

tbl_users.hasMany(tbl_search_history, {
  foreignKey: "id",
  targetKey: "id",
  onDelete: "CASCADE",
});
tbl_search_history.belongsTo(tbl_users, { foreignKey: "id", targetKey: "id" });

module.exports = { tbl_users, tbl_search_history, sequelize };
