import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";
import { ValidateUserCourse } from "../../../presentation/middlewares/validate-user.middleware";

export class UpdateUserCourseDto {

  constructor(
    public readonly templateId?: number,
    public readonly courseId?: number,
    public readonly hours?: number,
    public readonly points?: string
  ) {}

  private static schema: Schema = {
    templateId: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "template es requerido",
      },
      isNumeric: {
        bail: true,
        errorMessage: "template es invalido",
      },
      custom: {
        options: ValidateUserCourse.validateTemplate,
      },
    },
    courseId: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "curso es requerido",
      },
      isNumeric: {
        bail: true,
        errorMessage: "curso es invalido",
      },
      custom: {
        options: ValidateUserCourse.validateCourse,
      },
    },
    hours: {
      trim: true,
      optional: true,
      notEmpty: {
        bail: true,
        errorMessage: "horas es requerido",
      },
      isNumeric: {
        bail: true,
        errorMessage: "horas es invalido",
      },
    },
  };

  static async create(req: Request): Promise<[unknown?, UpdateUserCourseDto?]> {
    const { templateId, courseId, hours, points } = req.body;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field];

    return [
      undefined,
      new UpdateUserCourseDto( +templateId, +courseId, +hours, points),
    ];
  }
  
}
