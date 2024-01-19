import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../data/mysql/sequelize/index';
import { States } from "./courses.model";
  
export class TemplatesModel extends Model {
    
    declare id: number;
    declare name: string;
    declare certified: string;
    declare certifiedConstancy: string;
    declare state: States;

    declare createdAt: Date;
    declare updatedAt: Date;
}

TemplatesModel.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: {
        type: DataTypes.STRING
      },
      certified: {
        type: DataTypes.STRING
      },
      certifiedConstancy: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.ENUM,
        values: Object.values(States),
        defaultValue: States.ACTIVE,
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
    { sequelize, modelName: "templates" }
);