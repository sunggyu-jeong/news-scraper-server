const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../sequelize");
const { hashedPassword } = require("../../../comm/utils");

const tbl_users = sequelize.define("tbl_users", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

tbl_users.beforeCreate(async (user) => {
  const password = await hashedPassword(user.password);

  user.password = password;
});

tbl_users.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const password = await hashedPassword(user.password);
    user.password = password;
  }
});

module.exports = tbl_users;
