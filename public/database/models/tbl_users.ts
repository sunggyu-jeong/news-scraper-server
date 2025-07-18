import { DataTypes } from 'sequelize';
import { hashedPassword } from '../../../comm/utils';
import sequelize from '../sequelize';

const tbl_users = sequelize.define('tbl_users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
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
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

tbl_users.beforeCreate(async (user: any) => {
  const password = await hashedPassword(user.password);
  user.password = password;
});

tbl_users.beforeUpdate(async (user: any) => {
  if (user.changed('password')) {
    const password = await hashedPassword(user.password);
    user.password = password;
  }
});

export default tbl_users;
