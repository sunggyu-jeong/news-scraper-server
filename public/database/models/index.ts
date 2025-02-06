import sequelize from "../sequelize";
import tbl_default_keywords from "./tbl_default_keywords";
import tbl_keywords from "./tbl_keywords";
import tbl_users from "./tbl_users";

tbl_users.hasMany(tbl_keywords, {
  foreignKey: "id",
  onDelete: "CASCADE",
});
tbl_keywords.belongsTo(tbl_users, { foreignKey: "id" });
tbl_default_keywords.belongsTo(tbl_keywords, {
  foreignKey: "id",
});

export default sequelize;
