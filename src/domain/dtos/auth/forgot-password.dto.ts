import { Request } from "express";
import { ValidateField } from "../../../config";
import { Schema } from "express-validator";

export class ForgotPasswordDto {
    
  constructor(public email: string) {}

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
  };

  static async create(req: Request): Promise<[unknown?, ForgotPasswordDto?]> {
    const { email } = req.body;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [undefined, new ForgotPasswordDto( email )];
  }
}
