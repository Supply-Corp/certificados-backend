import { Request } from "express";
import { ValidateField } from "../../../config/validate-fields.util";
import { Schema } from "express-validator";
import { PasswordMiddleware } from "../../../presentation/middlewares/password.middleware";

export class UpdateUserDto {
    
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public documentNumber: string,
    public email: string,
    public password?: string
  ) {}

  private static schema: Schema = {
    id: {
      trim: true,
      notEmpty: {
        bail: true,
        errorMessage: 'Id es requerido'
      }
    },
    name: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "Nombre es requerido",
      },
      isString: {
        bail: true,
        errorMessage: "Nombre no puede ser un número",
      },
    },
    lastName: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "Apellido es requerido",
      },
      isString: {
        bail: true,
        errorMessage: "Apellido no puede ser un número",
      },
    },
    documentNumber: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "Número de documento es requerido",
      },
    },
    email: {
      trim: true,
      optional: true,
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
      optional: true,
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
      optional: true,
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
  };

  static async create(req: Request): Promise<[unknown?, UpdateUserDto?]> {
    const { name, lastName, documentNumber, email, password } = req.body;
    const { id } = req.params;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [
      undefined,
      new UpdateUserDto(+id, name, lastName, documentNumber, email, password),
    ];
  }
}
