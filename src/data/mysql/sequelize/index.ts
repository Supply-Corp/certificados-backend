import { Sequelize } from "sequelize";
import { envs } from "../../../config";

export const sequelize = new Sequelize({
    host: envs.DATABASE_HOST,
    username: envs.DATABASE_USER,
    password: envs.DATABASE_PASSWORD,
    database: envs.DATABASE_NAME,
    port: envs.DATABASE_PORT,
    dialect: 'mysql'
});