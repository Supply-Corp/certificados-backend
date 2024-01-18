import { Request } from "express";
import { ValidateField } from "../../../config/validate-fields.util";
import { Schema } from "express-validator";

export class CreateCoursesModuleDto {
    
    constructor(
        public name: string,
        public courseId: Date,
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
        courseId: {
            trim: true,
            isNumeric: {
                bail: true,
                errorMessage: 'el campo curso no es numérico'
            }
        },
    };

    static async create(req: Request): Promise<[unknown?, CreateCoursesModuleDto?]> {
        const { name, courseId } = req.body;

        const field = await ValidateField.create(this.schema, req);
        if (field) return [field];

        return [
            undefined,
            new CreateCoursesModuleDto(name, courseId),
        ];
    }
}
