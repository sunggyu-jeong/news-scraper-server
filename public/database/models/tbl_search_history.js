const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const tbl_search_history = sequelize.define("tbl_search_history", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "tbl_users",
      key: "id",
    },
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = tbl_search_history;
