import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";
import { ValidateUserCourse } from "../../../presentation/middlewares/validate-user.middleware";

export class CreateUserCourseDto {

    constructor(
        public readonly userId: number,
        public readonly templateId: number,
        public readonly courseId: number,
        public readonly hours: number,
        public readonly points: string
    ) {}

    private static schema: Schema = {
        userId: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "usuario es requerido",
            },
            isNumeric: {
                bail: true,
                errorMessage: "usuario es invalido",
            },
            custom: {
                options: ValidateUserCourse.validateUser
            }
        },
        templateId: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "template es requerido",
            },
            isNumeric: {
                bail: true,
                errorMessage: "template es invalido",
            },
            custom: {
                options: ValidateUserCourse.validateTemplate
            }
        },
        courseId: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "curso es requerido",
            },
            isNumeric: {
                bail: true,
                errorMessage: "curso es invalido",
            },
            custom: {
                options: ValidateUserCourse.validateCourse
            }
        },
        hours: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "horas es requerido",
            },
            isNumeric: {
                bail: true,
                errorMessage: "horas es invalido",
            },
        },
        points: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "puntos es requerido",
            },
        }
    };
    
    static async create(req: Request): Promise<[unknown?, CreateUserCourseDto?]> {
      const { userId, templateId, courseId, hours, points } = req.body;
  
      const field = await ValidateField.create(this.schema, req);
      if (field) return [field];
  
      return [
        undefined,
        new CreateUserCourseDto( +userId, +templateId, +courseId, +hours, points ),
      ];
    }

}