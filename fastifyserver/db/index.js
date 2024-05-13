const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ems', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
