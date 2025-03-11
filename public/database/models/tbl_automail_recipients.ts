import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const tbl_automail_recipients = sequelize.define('tbl_automail_recipients', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  recipientType: {
    field: 'recipientType',
    type: DataTypes.ENUM('TO', 'CC'),
    allowNull: false,
    defaultValue: 'TO',
    comment: '수신: TO, 참조: CC',
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

export default tbl_automail_recipients;
