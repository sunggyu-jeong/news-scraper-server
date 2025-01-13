const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../sequelize");

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
 
module.exports = tbl_search_history;
