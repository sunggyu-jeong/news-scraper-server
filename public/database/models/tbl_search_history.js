import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../sequelize.js";

const tbl_search_history = sequelize.define("tbl_search_history", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default tbl_search_history;
