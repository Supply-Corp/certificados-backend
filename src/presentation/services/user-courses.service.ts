import { Op } from "sequelize";
import { HashAdapter, JwtAdapter, Uuid } from "../../config";
import {
  CreateUserCourseDto,
  CustomError,
  PaginationDto,
  RegisterDto,
  UpdateCoursesDto,
  UpdateUserCourseDto,
  UpdateUserDto,
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
          role: 'USER'
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

  async registerUser(dto: RegisterDto) {
    const exist = await UserModel.findOne({ where: { email: dto.email } });
    if (exist) throw CustomError.notFound("El email ya se encuentra registrado.");

    try {
      const register = await UserModel.create({
        ...dto,
        password: HashAdapter.hash(dto.password),
      });

      const { password, ...userEntity } = UserEntity.fromObject(register.toJSON());

      return { ...userEntity };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async updateUser(dto: UpdateUserDto) {

    const exist = await UserModel.findOne({ where: { id: dto.id } });
    if ( !exist ) throw CustomError.notFound("No es posible editar el usuario.");

    if( exist.email !== dto.email ) {
      const validateEmail = await UserModel.findOne({ where: { email: dto.email } });
      if( validateEmail ) return CustomError.notFound('El email ya se encuentra registrado');
    }

    try {
      const register = await exist.update({
        ...dto,
        // password: dto.password ? HashAdapter.hash(dto.password) : undefined
      });

      const { password, ...userEntity } = UserEntity.fromObject(register.toJSON());

      return { ...userEntity };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async deleteUser(id: number) {
    const exist = await UserModel.findOne({ where: { id } });
    if (!exist) throw CustomError.notFound("No existe usuario");

    try {
      await exist.destroy();

      return {
        ...UserEntity.fromObject(exist),
      };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async listUserCourses(dto: PaginationDto, id: number) {
    const { page, limit } = dto;

    try {
      const user = await UserModel.findOne({ where: { id } });
      if( !user ) throw CustomError.badRequest('El usuario no existe');
      
      const { count: total, rows: courses } =
      await UserCoursesModel.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        where: {
          userId: id,
        },
        include: ['template', 'course'],
      });

      const pagination = PaginationService.get(page, limit, total, `/api/user-courses/${ id }`);
      const usersCourses = courses.map(UserCoursesEntity.fromObject);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        ...pagination,
        courses: usersCourses,
        user: userEntity
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

      return {
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
      const { templateId, courseId, hours, points } = dto;

      const update = await exist.update({
        where: { id },
        templateId: templateId ? templateId : exist.templateId,
        courseId: courseId ? courseId : exist.courseId,
        hours: hours ? hours : exist.hours,
        points: points ? points : exist.hours,
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
