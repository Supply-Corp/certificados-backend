import { Meta } from "express-validator";


export class PasswordMiddleware {

    constructor() {}

    static comparePassword(value: string, options: Meta){

        const { password } = options.req.body;
        if( value === password) return true;
        
        throw new Error('Las contraseñas no coinciden');
    }

}