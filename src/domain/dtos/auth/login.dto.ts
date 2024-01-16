import { Request } from "express";
import { ValidateField } from "../../../config";
import { Schema } from "express-validator";

export class LoginDto {
    
  constructor(public email: string, public password: string) {}

  private static schema: Schema = {
    email: {
      trim: true,
      notEmpty: {
        bail: true,
        errorMessage: "Correo electrónico requerido",
      },
      isEmail: {
        bail: true,
        errorMessage: "Correo electrónico no es válido",
      },
    },
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
  };

  static async create(req: Request): Promise<[unknown?, LoginDto?]> {
    const { email, password } = req.body;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [undefined, new LoginDto(email, password)];
  }
}
