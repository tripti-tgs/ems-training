import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ems', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;