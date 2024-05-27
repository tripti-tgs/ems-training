import Department from './department';
import { DataTypes, Model, Optional} from 'sequelize';
import sequelize from '../db/index';
import User from './user';

interface EmployeeAttributes {
  id?: number;
  name: string;
  email: string;
  phone: number;
  gender: number;
  dob: Date;
  emp_img: string;
  dept_id?: number;
  isDeleted?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, "id"> {}

const Employee = sequelize.define<Model<EmployeeAttributes, EmployeeCreationAttributes>>('Employee', {
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
  emp_img: DataTypes.BLOB,
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
  timestamps: false,
  tableName: 'employee'
}as import('sequelize').ModelOptions<Model<EmployeeAttributes, EmployeeCreationAttributes>>
);

Employee.belongsTo(Department, { foreignKey: 'dept_id' });
Employee.belongsTo(User, { as: 'createdByUser', foreignKey: 'created_by' });
Employee.belongsTo(User, { as: 'updatedByUser', foreignKey: 'updated_by' });
Employee.belongsTo(User, { as: 'deletedByUser', foreignKey: 'deleted_by' });

export default Employee;
