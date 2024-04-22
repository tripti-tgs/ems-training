const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hr', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
