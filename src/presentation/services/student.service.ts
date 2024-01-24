import { CourseModulesEntity, CustomError } from "../../domain";
import { CoursesModel, CoursesModulesModel, UserCoursesModel, UserModel } from "../../domain/models";
import { UserCoursesEntity } from '../../domain/entities/user-course.entity';
import path from 'path';
import fs from 'fs';
import { CertifiedService } from "./certified.service";
import { ConstancyService } from "./constance.service";


export class StudentService {

    constructor(
        private certified: CertifiedService,
        private constancy: ConstancyService
    ) {}

    async studentCourses( id: number ) {

        const user = await UserModel.findOne({ where: { id } });
        if( !user ) throw CustomError.notFound('No se encontró información acerca del usuario');

        try {

            const courses = await UserCoursesModel.findAll({ where: { userId: id }, include: ['course', 'template']});

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

    async generateConstancy( identifier: string ) {

        const certified = await UserCoursesModel.findOne({
             where: { identifier }, 
             include: [
                'template',
                'course',
                'user', 
            ] 
        });
        if( !certified ) throw CustomError.notFound('No se encontró información acerca del certificado');

        const modules = await CoursesModulesModel.findAll({ where: { courseId: certified.course?.id, state: 'ACTIVE' } })

        try {

            const newModules =  modules.map(CourseModulesEntity.fromObject);

            const newCertified = { ...certified.toJSON() };
            newCertified.modules = newModules;

            const destination = path.resolve(__dirname, `../../../public/constancy/${ certified.identifier }.pdf`);
            if(fs.existsSync( destination )) return `${ certified.identifier }.pdf`;

            return await this.constancy.generate( newCertified )

        } catch (error) {
            console.log(`${ error }`)
            throw CustomError.internalServe(`${ error }`);
        }

    }


}