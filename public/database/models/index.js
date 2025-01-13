import sequelize from "../sequelize.js";
import tbl_search_history from "./tbl_search_history.js";
import tbl_users from "./tbl_users.js";

tbl_users.hasMany(tbl_search_history, {
  foreignKey: "id",
  targetKey: "id",
  onDelete: "CASCADE",
});
tbl_search_history.belongsTo(tbl_users, { foreignKey: "id", targetKey: "id" });

export default sequelize;
