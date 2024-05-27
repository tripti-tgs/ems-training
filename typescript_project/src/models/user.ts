import { Sequelize, DataTypes, Model,Op  } from 'sequelize';
import sequelize from '../db/index';

interface UserAttributes {
  id?: number|string;
  username: string;
  email: string;
  password: string|number;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id?: number;
  public username!: string;
  public email!: string;
  public password!: string;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: false,
  }
);

export default User;
