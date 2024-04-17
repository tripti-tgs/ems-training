const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const User = require('./user');

const Department = sequelize.define('department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  isDeleted: DataTypes.TINYINT,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  deleted_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'department',
  timestamps: false,
  tableName: 'department'
});
Department.deleteDepartment = async (deptId) => {
  const [results] = await sequelize.query("CALL DeleteDepartment(:deptId)", {
    replacements: { deptId },
  });
  return results;
};
module.exports = Department;
