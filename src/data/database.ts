import { sequelize } from "./mysql/sequelize";

export class DatabaseConfig {

    constructor() {}

    static async testConnection() {
        try {
            await sequelize.sync();
            console.log(`database connected`);
        } catch (error) {
            console.log(`error database connection ${ error }`);
        }
    }

}