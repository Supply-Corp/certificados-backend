import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../data/mysql/sequelize/index';

export enum States {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
};
  
export class CoursesModel extends Model {
declare id: number;
declare name: string;
declare initialDate: string;
declare endDate: string;
declare state: States;

declare createdAt: Date;
declare updatedAt: Date;
}

CoursesModel.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: {
        type: DataTypes.STRING
      },
      initialDate: {
        type: DataTypes.DATE
      },
      endDate: {
        type: DataTypes.DATE
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
    { sequelize, modelName: "courses" }
  );