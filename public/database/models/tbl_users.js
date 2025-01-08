const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const bcrypt = require("bcrypt");

const tbl_users = sequelize.define("tbl_users", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
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
});

tbl_users.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = tbl_users;
