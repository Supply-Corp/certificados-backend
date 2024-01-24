import 'dotenv/config';
import { get } from "env-var";



export const envs = {

    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').required().asString(),

    // DATABASE_URL: get('DATABASE_URL').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),

    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET: get('MAILER_SECRET').required().asString(),

    WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
    WEB_TEMPLATE_URL: get('WEB_TEMPLATE_URL').required().asString(),

    DATABASE_HOST: get('DATABASE_HOST').required().asString(),
    DATABASE_USER: get('DATABASE_USER').required().asString(),
    DATABASE_PASSWORD: get('DATABASE_PASSWORD').asString(),
    DATABASE_PORT: get('DATABASE_PORT').required().asPortNumber(),
    DATABASE_DIALECT: get('DATABASE_DIALECT').required().asString(),
    DATABASE_NAME: get('DATABASE_NAME').required().asString(),
    TZ: get('TZ').required().asString(),
}