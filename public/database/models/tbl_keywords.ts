import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../sequelize';

const tbl_keywords = sequelize.define('tbl_keywords', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  keywordId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default tbl_keywords;
