import { Sequelize } from "sequelize";
import { envs } from "../../../config";

export const sequelize = new Sequelize(`${envs.DATABASE_URL}`);