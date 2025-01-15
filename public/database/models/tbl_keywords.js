import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../sequelize.js";

const tbl_keywords = sequelize.define("tbl_keywords", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  keyword_id: {
    type: Sequelize.INTEGER,
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

export default tbl_keywords;
