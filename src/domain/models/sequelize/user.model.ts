import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../data/mysql/sequelize/index';
import { HashAdapter } from "../../../config";

const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
  };

  
export class UserModel extends Model {
    
    declare id: number;
    declare name: string;
    declare lastName: string;
    declare documentNumber: string;
    declare email: string;
    declare password: string;
    declare role: typeof Role;
    declare recoveryPassword: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

UserModel.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      documentNumber: {
        type: DataTypes.STRING
      },
      email: { 
        type: DataTypes.STRING, 
        unique: true 
      },
      password: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(Role),
        defaultValue: Role.USER,
      },
      recoveryPassword: { 
        type: DataTypes.BOOLEAN, 
        allowNull: true 
      },
      createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, modelName: "user" }
);
  
UserModel.beforeUpdate((user, options) => {
  if (user.changed('password')) {
    user.password = HashAdapter.hash(user.password);
  }
});