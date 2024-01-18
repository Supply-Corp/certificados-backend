import { Request } from "express";
import { ValidateField } from "../../../config/validate-fields.util";
import { Schema } from "express-validator";

export class UpdateCoursesModuleDto {
    
    constructor(
        public id: number,
        public name: string,
        public courseId: Date,
    ) {}

    private static schema: Schema = {
        id: {
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: 'el id es requerido'
            },
            isNumeric: {
                bail: true,
                errorMessage: 'id no es numérico'
            }
        },  
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

    static async create(req: Request): Promise<[unknown?, UpdateCoursesModuleDto?]> {
        const { name, courseId } = req.body;
        const { id } = req.params;

        const field = await ValidateField.create(this.schema, req);
        if (field) return [field];

        return [
        undefined,
        new UpdateCoursesModuleDto(+id, name, courseId),
        ];
    }
}
