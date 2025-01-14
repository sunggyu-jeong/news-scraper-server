import sequelize from "../sequelize.js";
import tbl_default_keywords from "./tbl_default_keywords.js";
import tbl_keywords from "./tbl_keywords.js";
import tbl_users from "./tbl_users.js";

tbl_users.hasMany(tbl_keywords, {
  foreignKey: "id",
  targetKey: "id",
  onDelete: "CASCADE",
});
tbl_keywords.belongsTo(tbl_users, { foreignKey: "id", targetKey: "id" });
tbl_default_keywords.belongsTo(tbl_keywords, {
  foreignKey: "id",
  targetKey: "id",
});

export default sequelize;
