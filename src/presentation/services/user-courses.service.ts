import { Op } from "sequelize";
import { Uuid } from "../../config";
import {
  CreateUserCourseDto,
  CustomError,
  PaginationDto,
  UpdateCoursesDto,
  UpdateUserCourseDto,
  UserCoursesEntity,
  UserEntity,
} from "../../domain";
import {
  TemplatesModel,
  UserCoursesModel,
  UserModel,
} from "../../domain/models";
import { PaginationService } from "./pagination.service";

export class UserCoursesService {
  constructor(private uuid = Uuid.v4) {}

  async listUser(dto: PaginationDto) {
    const { page, limit, search } = dto;

    try {
      const { count: total, rows: users } = await UserModel.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        where: {
          ...(search && {
            [Op.and]: {
              name: {
                startsWith: `%${search}`,
              },
            },
          }),
        },
      });

      const pagination = PaginationService.get(page, limit, total, "/api/user-courses");

      const usersInformation = users.map((item) => {
        const userObject = item.toJSON();
        const { password, ...user } = userObject;
        return user;
      });

      return {
        ...pagination,
        users: usersInformation,
      };

    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async listUserCourses(dto: PaginationDto, id: number) {
    const { page, limit } = dto;

    try {
        const { count: total, rows: courses } =
        await UserCoursesModel.findAndCountAll({
          offset: (page - 1) * limit,
          limit: limit,
          where: {
            userId: id,
          },
          include: ['template', 'course'],
        });

        const pagination = PaginationService.get(page, limit, total, `/api/user-courses/${id}`);
        const usersCourses = courses.map(UserCoursesEntity.fromObject);

        return {
          ...pagination,
          courses: usersCourses,
        };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async createUserCourse(dto: CreateUserCourseDto) {
    try {
      const identifier = this.uuid();

      const create = await UserCoursesModel.create({
        identifier,
        ...dto,
      });

      // const { password, recoveryPassword, ...userInfo } = create.user;
      // const { user, ...data } = create;

      return {
        // ...data,
        user: create.toJSON(),
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServe(`${error}`);
    }
  }

  async updateUserCourse(dto: UpdateUserCourseDto, id: number) {
    const exist = await UserCoursesModel.findOne({ where: { id } });
    if (!exist) throw CustomError.notFound("No existe el curso del usuario");

    try {
      const { templateId, courseId, hours } = dto;

      const update = await exist.update({
        where: { id },
        templateId: templateId ? templateId : exist.templateId,
        courseId: courseId ? courseId : exist.courseId,
        hours: hours ? hours : exist.hours,
      });

      return {
        ...UserCoursesEntity.fromObject(update),
      };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async deleteUserCourse(id: number) {
    const exist = await UserCoursesModel.findOne({ where: { id } });
    if (!exist) throw CustomError.notFound("No existe el curso del usuario");

    try {
      await exist.destroy();

      return {
        ...UserCoursesEntity.fromObject(exist),
      };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }
}
