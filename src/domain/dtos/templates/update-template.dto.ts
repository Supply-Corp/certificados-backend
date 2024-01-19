import { UploadedFile } from "express-fileupload";
import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";

interface FileInfo {
  inputName: string,
  file: UploadedFile
}

export class UpdateTemplateDto {

    constructor(
      public readonly id: number,
      public readonly name?: string,
      public readonly files?: FileInfo[]
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
    
        const files = req.body.files;

        const field = await ValidateField.create(this.schema, req);
        if (field) return [field];
    
        if( files && !(files as FileInfo[]) ) throw 'file inválido';
        console.log({ files})

        return [
          undefined,
          new UpdateTemplateDto( +id, name, files ),
        ];
    }

}