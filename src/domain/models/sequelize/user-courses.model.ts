import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../data/mysql/sequelize/index";
import { UserModel } from "./user.model";
import { TemplatesModel } from "./templates.model";
import { CoursesModel } from "./courses.model";
import { UserEntity } from "../../entities/user.entity";
import { TemplateEntity } from "../../entities/template.entity";
import { CourseEntity } from "../../entities/course.entity";

export class UserCoursesModel extends Model {
  declare id: number;
  declare identifier: string;
  declare userId: number;
  declare templateId: number;
  declare courseId: number;
  declare hours: number;

  declare user?: UserEntity;
  declare template?: TemplateEntity;
  declare course?: CourseEntity;

  declare createdAt: Date;
  declare updatedAt: Date;
}

UserCoursesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: TemplatesModel,
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: CoursesModel,
        key: "id",
      },
    },
    hours: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "user_courses" }
);

UserCoursesModel.belongsTo(UserModel, { as: 'user', foreignKey: 'userId' });
UserCoursesModel.belongsTo(TemplatesModel, { as: 'template' });
UserCoursesModel.belongsTo(CoursesModel, { as: 'course' });