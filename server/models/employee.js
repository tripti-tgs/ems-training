const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const User = require('./user');
const Department = require('./department');

const Employee = sequelize.define('employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.INTEGER,
  gender: DataTypes.TINYINT,
  dob: DataTypes.DATE,
  emp_img:DataTypes.BLOB,
  dept_id: DataTypes.INTEGER,
  isDeleted: DataTypes.TINYINT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
  created_by: DataTypes.INTEGER,
  updated_by: DataTypes.INTEGER,
  deleted_by: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'employee',
  timestamps: false,
  tableName: 'employee'
});

Employee.belongsTo(Department, { foreignKey: 'dept_id' });
Employee.belongsTo(User, { as: 'createdByUser', foreignKey: 'created_by' });
Employee.belongsTo(User, { as: 'updatedByUser', foreignKey: 'updated_by' });
Employee.belongsTo(User, { as: 'deletedByUser', foreignKey: 'deleted_by' });


module.exports = Employee;
