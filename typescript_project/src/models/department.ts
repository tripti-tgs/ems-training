import { DataTypes, Model, Optional ,Sequelize} from 'sequelize';
import sequelize from '../db/index';
import User from './user';



interface DepartmentAttributes {
  id?: number;
  name: string;
  isDeleted?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  created_by?: number | string;
  updated_by?: number | string;
  deleted_by?: number | string | null;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'isDeleted' | 'deleted_at' | 'deleted_by'> {}

const Department = sequelize.define<Model<DepartmentAttributes, DepartmentCreationAttributes>>(
  'Department',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize, 
    tableName: 'department',
    timestamps: false, 
    modelName: 'Department'
  }as import('sequelize').ModelOptions<Model<DepartmentAttributes, DepartmentCreationAttributes>>
);


export default Department;
