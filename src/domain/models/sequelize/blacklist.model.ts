import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../../data/mysql/sequelize/index';

export class BlackList extends Model {
    declare id: number;
    declare token: string;
}

BlackList.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      token: {
        type: DataTypes.STRING
      },
    },
    { sequelize, timestamps: false, modelName: "blacklist" }
  );