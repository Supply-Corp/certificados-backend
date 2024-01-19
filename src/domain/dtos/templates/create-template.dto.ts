import { UploadedFile } from "express-fileupload";
import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";

interface FileInfo {
  fileName: string,
  file: UploadedFile
}

export class CreateTemplateDto {

    constructor(
        public readonly name: string,
        public readonly files: FileInfo[]
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
    };
    
    static async create(req: Request): Promise<[unknown?, CreateTemplateDto?]> {
      const { name } = req.body;
      const files = req.body.files;

      const field = await ValidateField.create(this.schema, req);
      if (field) return [field];
  
      if( !(files as FileInfo[]) ) throw 'file inválido';

      return [
        undefined,
        new CreateTemplateDto( name, files ),
      ];
    }

}