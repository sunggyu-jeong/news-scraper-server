import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../sequelize";

const tbl_default_keywords = sequelize.define("tbl_default_keywords", {
  keywordId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default tbl_default_keywords;
