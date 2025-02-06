import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'postgres://sgmaster:asdf0109!@localhost:5432/sg_master?sslmode=disable',
  {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
