import { Request } from "express";
import { ValidateField } from "../../../config";
import { Schema } from "express-validator";
import { PasswordMiddleware } from "../../../presentation/middlewares/password.middleware";

export class RecoveryPasswordDto {
    
    constructor(
        public token: string,
        public password: string
    ) {}

    private static schema: Schema = {
        password: {
        trim: true,
        notEmpty: {
            bail: true,
            errorMessage: "Contraseña es requerido",
        },
        isLength: {
            bail: true,
            options: {
            min: 8,
            },
            errorMessage: "Contraseña requiere mínimo 8 caracteres",
        },
        },
        passwordConfirmation: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "Repetir contraseña es requerido",
            },
            isLength: {
                bail: true,
                options: {
                    min: 8,
                },
                errorMessage: "Repetir contraseña requiere mínimo 8 caracteres",
            },
            custom: {
                bail: true,
                options: PasswordMiddleware.comparePassword,
            },
        },
        token: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: 'El token de restablecimiento es requerido'
            }
        }
    };

  static async create(req: Request): Promise<[unknown?, RecoveryPasswordDto?]> {
    const { password, token } = req.body;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [undefined, new RecoveryPasswordDto( token, password )];
  }
}