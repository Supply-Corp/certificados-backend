import { CustomError } from "../../domain";
import { UserCoursesModel, UserModel } from "../../domain/models";
import { UserCoursesEntity } from '../../domain/entities/user-course.entity';
import { CertifiedService } from "./certified.service";
import path from 'path';
import fs from 'fs';


export class StudentService {

    constructor(
        private certified: CertifiedService
    ) {}

    async studentCourses( id: number ) {

        const user = await UserModel.findOne({ where: { id } });
        if( !user ) throw CustomError.notFound('No se encontró información acerca del usuario');

        try {

            const courses = await UserCoursesModel.findAll({ where: { userId: id }, include: ['course']});

            return {
                courses: courses.map(UserCoursesEntity.fromObject)
            }

        } catch (error) {
            console.log(`${ error }`)
            throw CustomError.internalServe(`${ error }`);
        }

    }

    async generateCertified( identifier: string ) {

        const certified = await UserCoursesModel.findOne({ where: { identifier }, include: ['template','course','user'] });
        if( !certified ) throw CustomError.notFound('No se encontró información acerca del certificado');

        try {

            const destination = path.resolve(__dirname, `../../../public/certified/${ certified.identifier }.pdf`);

            if(fs.existsSync( destination )) return `${ certified.identifier }.pdf`;

            return await this.certified.generate( certified.toJSON() )

        } catch (error) {
            console.log(`${ error }`)
            throw CustomError.internalServe(`${ error }`);
        }

    }

}