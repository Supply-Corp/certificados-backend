import { UploadedFile } from "express-fileupload";
import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";

export class UpdateTemplateDto {

    constructor(
      public readonly id: number,
      public readonly name?: string,
      public readonly file?: UploadedFile
    ) {}

    private static schema: Schema = {
      id: {
        trim: true,
        notEmpty: {
          bail: true,
          errorMessage: 'Id es requerido'
        },
        isNumeric: {
          bail: true,
          errorMessage: 'Id no es numérico'
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
    };
    
    static async create(req: Request): Promise<[unknown?, UpdateTemplateDto?]> {
        const { name } = req.body;
        const id = req.params.id;
    
        const field = await ValidateField.create(this.schema, req);
        if (field) return [field];
    
        const file = req.files?.file;
        if( file && !(file as UploadedFile) ) throw 'la imagen no es valida';

        return [
          undefined, 
          new UpdateTemplateDto( +id, name, file as UploadedFile ),
        ];
    }

}