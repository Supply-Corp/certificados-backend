import {
  CourseEntity,
  CreateCoursesDto,
  CustomError,
  PaginationDto,
  UpdateCoursesDto,
} from "../../domain";
import { CoursesModel, States } from "../../domain/models";
import { PaginationService } from "./pagination.service";
import { Op } from "sequelize";

export class CoursesService {

    async listCourse(dto: PaginationDto) {
        const { page, limit, search } = dto;

        const { count: total, rows: courses } = await CoursesModel.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['id', 'DESC']],
            where: {
                state: States.ACTIVE,
                [Op.and]: [
                    {
                        ...(search && {
                            name: {
                                [Op.like]: `%${ search }%`
                            }
                        }),
                    },
                ],
            },
        });

        const pagination = PaginationService.get(
            page,
            limit,
            total,
            "/api/courses"
        );

        return {
            ...pagination,
            courses: courses.map(CourseEntity.fromObject),
        };
    }

    async allCourses() {

        const courses = await CoursesModel.findAll({
            order: [['id', 'DESC']],
            where: { state: States.ACTIVE }
        });

        return {
            courses: courses.map(CourseEntity.fromObject),
        };
    }

    async getCourse(id: number) {
    const course = await CoursesModel.findOne({ where: { id } });
    if (!course) throw CustomError.notFound("El cursos solicitado no existe");

    if (course.state === States.DELETED) throw CustomError.notFound("El cursos solicitado no existe");

    return {
        ...CourseEntity.fromObject(course),
    };
    }

    async createCourse(dto: CreateCoursesDto) {
        try {
            const course = await CoursesModel.create({
                ...dto,
                initialDate: new Date(dto.initialDate),
                endDate: new Date(dto.endDate),
            });

            return {
                ...CourseEntity.fromObject(course),
            };
        } catch (error) {
            throw CustomError.internalServe(`${error}`);
        }
    }

    async updateCourse(dto: UpdateCoursesDto) {
        const course = await CoursesModel.findOne({ where: { id: dto.id } });
        if (!course) throw CustomError.notFound("El curso no existe");

        if (course.state === States.DELETED)
            throw CustomError.notFound("El curso no existe");

        try {
            const { id, ...data } = dto;

            const update = await course.update({
                ...data,
                initialDate: data.initialDate ? new Date(data.initialDate) : course.initialDate,
                endDate: data.endDate ? new Date(data.endDate) : course.endDate,
                },
                { where: { id: dto.id } }
            );

            return {
                ...CourseEntity.fromObject(update),
            };
        } catch (error) {
            throw CustomError.internalServe(`${error}`);
        }
    }

    async deleteCourse(id: number) {
        const course = await CoursesModel.findOne({ where: { id } });
        if( !course ) throw CustomError.notFound('El curso no existe');

        if( course.state === States.DELETED) throw CustomError.notFound('El curso no existe');

        try {
            const update = await course.update({
                where: { id },
                state: States.DELETED
            });
            return {
                ...CourseEntity.fromObject(update)
            }
        } catch (error) {
            throw CustomError.internalServe(`${error}`);
        }
    }

}
