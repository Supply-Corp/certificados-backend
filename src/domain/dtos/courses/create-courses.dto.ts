import { Request } from "express";
import { ValidateField } from "../../../config/validate-fields.util";
import { Schema } from "express-validator";
import { ValidateDateMiddleware } from '../../../presentation/middlewares/validate-date.middleware';

export class CreateCoursesDto {
    
  constructor(
    public name: string,
    public initialDate: Date,
    public endDate: Date,
  ) {}

  private static schema: Schema = {
    name: {
      trim: true,
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
        notEmpty: { 
            bail: true,
            errorMessage: 'La fecha inicial es requerida'
        },
        custom: {
            options: ValidateDateMiddleware.get
        }
    },
    endDate: {
        trim: true,
        notEmpty: { 
            bail: true,
            errorMessage: 'La fecha final es requerida'
        },
        custom: {
            options: ValidateDateMiddleware.get
        }
    }
  };

  static async create(req: Request): Promise<[unknown?, CreateCoursesDto?]> {
    const { name, initialDate, endDate } = req.body;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [
      undefined,
      new CreateCoursesDto(name, initialDate, endDate),
    ];
  }
}
