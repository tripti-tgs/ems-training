const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const User = require('./user');
const Employee = require('./employee');

const Salary = sequelize.define('salary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  emp_id: DataTypes.INTEGER,
  salary: DataTypes.DECIMAL(10, 2),
  date: DataTypes.DATE,
  isDeleted: DataTypes.TINYINT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  deleted_by: DataTypes.INTEGER
}, { 
  sequelize, 
  modelName: 'salary',
  timestamps: false,
  tableName: 'salary'
});

Salary.belongsTo(Employee, { foreignKey: 'emp_id' });
// Salary.belongsTo(User, { as: 'createdByUser', foreignKey: 'created_by' });
// Salary.belongsTo(User, { as: 'updatedByUser', foreignKey: 'updated_by' });
// Salary.belongsTo(User, { as: 'deletedByUser', foreignKey: 'deleted_by' });

module.exports = Salary;
