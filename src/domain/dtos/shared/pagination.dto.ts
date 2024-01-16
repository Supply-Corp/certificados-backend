import { Request } from "express";
import { ValidateField } from "../../../config";
import { Schema } from "express-validator";

export class PaginationDto {
    
  constructor(
    public page: number,
    public limit: number,
    public search?: string,
  ) {}

  private static schema: Schema = {
    page: {
        trim: true,
        notEmpty: {
          bail: true,
          errorMessage: 'El número de página es requerido'
        },
        isNumeric: {
          bail: true,
          errorMessage: 'La página no es un número válido'
        },
    },
    limit: {
        trim: true,
        notEmpty: {
          bail: true,
          errorMessage: 'El limit  es requerido'
        },
        isNumeric: {
          bail: true,
          errorMessage: 'El limit no es un número válido'
        },
    },
    search: {
      trim: true,
      optional: true
    }
  };

  static async create(req: Request): Promise<[unknown?, PaginationDto?]> {
    const { page = 1, limit = 10, search } = req.query;

    const field = await ValidateField.create(this.schema, req);
    if (field) return [field]; 

    if( +page <= 0 ) return ['Page number not valid'];
    if( +limit <=0 ) return ['Limit number not valid'];
    
    return [undefined, new PaginationDto(+page, +limit, search as string)];
  }

}
