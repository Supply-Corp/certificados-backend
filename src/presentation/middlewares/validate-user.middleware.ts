import { CoursesModel, TemplatesModel, UserModel } from "../../domain/models";


export class ValidateUserCourse {

    static async validateUser( value: string ) {
        
        const exist = await UserModel.findOne({ where: { id: +value } });
        if( !exist ) throw new Error('usuario inválido o no existe');

        return true;
    }

    static async validateCourse( value: string ) {
        
        const exist = await CoursesModel.findOne({ where: { id: +value } });
        if( !exist ) throw new Error('curso inválido o no existe');

        return true;
    }

    static async validateTemplate( value: string ) {
        
        const exist = await TemplatesModel.findOne({ where: { id: +value } });
        if( !exist ) throw new Error('template inválido o no existe');

        return true;
    }

}