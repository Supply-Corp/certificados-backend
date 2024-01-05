import { Request } from "express";
import { ValidateField } from "../../utils/validate-fields.util";

export class RegisterDto {
  
    constructor() {}

    private static schema = {};

    static async create(req: Request): Promise<[unknown?, RegisterDto?]> {

        const field = await ValidateField.create( this.schema, req );
        if( !field ) return [field];

        return [undefined, new RegisterDto()];
    }

}
