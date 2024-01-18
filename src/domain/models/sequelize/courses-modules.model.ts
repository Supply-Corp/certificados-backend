import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../data/mysql/sequelize/index';
import { CoursesModel, States } from "./courses.model";

export class CoursesModulesModel extends Model {
  declare id: number;
  declare name: string;
  declare courseId: number;
  declare course: CoursesModel;
  declare state: States;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CoursesModulesModel.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: {
        type: DataTypes.STRING
      },
      courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: CoursesModel,
            key: 'id'
        }
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
    { sequelize, modelName: "courses_modules" }
  );