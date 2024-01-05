import { Request } from "express";
import { ValidateField } from "../../utils/validate-fields.util";

export class LoginDto {
  
    constructor() {}

    private static schema = {};

    static async create(req: Request): Promise<[unknown?, LoginDto?]> {
        
        const field = await ValidateField.create( this.schema, req );
        if( !field ) return [field];

        return [undefined, new LoginDto()];
    }

}
