import { UploadedFile } from "express-fileupload";
import { Schema } from "express-validator";
import { ValidateField } from "../../../config";
import { Request } from "express";

export class CreateTemplateDto {

    constructor(
        public readonly name: string,
        public readonly file: UploadedFile
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
      const file = req.body.files.at(0);
  
      const field = await ValidateField.create(this.schema, req);
      if (field) return [field];
  
      if( !(file as UploadedFile) ) throw 'file inválido';

      return [
        undefined,
        new CreateTemplateDto( name, file ),
      ];
    }

}