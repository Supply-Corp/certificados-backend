import { Request } from "express";
import { ValidateField } from "../../../config/validate-fields.util";
import { Schema } from "express-validator";
import { ValidateDateMiddleware } from '../../../presentation/middlewares/validate-date.middleware';

export class UpdateCoursesDto {
    
  constructor(
    public id: number,
    public name?: string,
    public initialDate?: Date,
    public endDate?: Date,
  ) {}

  private static schema: Schema = {
    id: {
      trim: true,
      notEmpty: {
        bail: true,
        errorMessage: 'El id es requerido'
      },
      isNumeric: {
        bail: true,
        errorMessage: 'El id no es numérico'
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
    initialDate: {
        trim: true,
        optional: true,
        notEmpty: { 
            bail: true,
            errorMessage: 'La fecha inicial es requerida'
        },
        custom: {
            options: ValidateDateMiddleware.get
        },
    },
    endDate: {
        trim: true,
        optional: true,
        notEmpty: { 
            bail: true,
            errorMessage: 'La fecha final es requerida'
        },
        custom: {
            options: ValidateDateMiddleware.get
        },
    }
  };

  static async create(req: Request): Promise<[unknown?, UpdateCoursesDto?]> {
    const { name, initialDate, endDate } = req.body;
    const id = req.params.id

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [
      undefined,
      new UpdateCoursesDto(+id, name, initialDate, endDate),
    ];
  }
}
