import {
  CourseModulesEntity,
  CreateCoursesModuleDto,
  CustomError,
  UpdateCoursesModuleDto,
} from "../../domain";
import { CoursesModel, CoursesModulesModel, States } from "../../domain/models";

export class CoursesModulesService {
    
    async allModules( id: number ) {

        const course = await CoursesModel.findOne({ where: { id } });
        const modules = await CoursesModulesModel.findAll({ where: { courseId: id, state: 'ACTIVE' }});

        return {
            modules: modules.map(CourseModulesEntity.fromObject),
            course: course
        };
    }

    async getModules(id: number) {
        const module = await CoursesModulesModel.findOne({ where: { id } });
        if (!module) throw CustomError.notFound("El modulo solicitado no existe");

        if (module.state === States.DELETED)
        throw CustomError.notFound("El modulo solicitado no existe");

        return {
            ...CourseModulesEntity.fromObject(module),
        };
    }

    async createModules(dto: CreateCoursesModuleDto) {
        try {
            const course = await CoursesModulesModel.create({
                ...dto,
            });

            return {
                ...CourseModulesEntity.fromObject(course),
            };
        } catch (error) {
            throw CustomError.internalServe(`${error}`);
        }
    }

    async updateModules(dto: UpdateCoursesModuleDto) {
        const module = await CoursesModulesModel.findOne({ where: { id: dto.id } });
        if (!module) throw CustomError.notFound("El modulo no existe");

        if (module.state === States.DELETED)
        throw CustomError.notFound("El modulo no existe");

        try {
            const { id, ...data } = dto;

            const update = await module.update(
                { ...data },
                { where: { id: dto.id } }
            );

            return {
                ...CourseModulesEntity.fromObject(update),
            };
        } catch (error) {
        throw CustomError.internalServe(`${error}`);
        }
    }

    async deleteModules(id: number) {
        const module = await CoursesModulesModel.findOne({ where: { id } });
        if (!module) throw CustomError.notFound("El modulo no existe");

        if (module.state === States.DELETED)
        throw CustomError.notFound("El modulo no existe");

        try {
            const update = await module.update({
                where: { id },
                state: States.DELETED,
            });
            return {
                ...CourseModulesEntity.fromObject(update),
            };
        } catch (error) {
            throw CustomError.internalServe(`${error}`);
        }
    }
}
