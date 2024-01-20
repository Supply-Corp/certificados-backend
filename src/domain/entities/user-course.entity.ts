import { UserEntity } from "./user.entity";
import { TemplateEntity } from './template.entity';
import { CourseEntity } from './course.entity';

export class UserCoursesEntity {

    constructor(
        public readonly id: number,
        public readonly identifier: string,
        public readonly userId: number,
        public readonly templateId: number,
        public readonly courseId: number,
        public readonly hours: number,
        public readonly points: number,

        public readonly user?: UserEntity,
        public readonly template?: TemplateEntity,
        public readonly course?: CourseEntity,

        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    static fromObject(object: { [key: string]: any }) {

        const {
          id,
          identifier,
          userId,
          templateId,
          courseId,
          hours,
          points,

          user,
          template,
          course,

          createdAt,
          updatedAt,
        } = object;
    
        if (!id) throw "missing id";
        if (!identifier) throw "missing identifier";
        if (!userId) throw "missing userId";
        if (!templateId) throw "missing templateId";
        if (!courseId) throw "missing courseId";
        if(!hours) throw "missing hours";
        if( !points ) throw "missing points"; 

        if( user && !(user as UserEntity)) throw "user not is user entity";
        if( template && !(template as TemplateEntity)) throw "template not is template entity";
        if( course && !(course as CourseEntity)) throw "course not is course entity";

        
        return new UserCoursesEntity(
            id,
            identifier,
            userId,
            templateId,
            courseId,
            hours,
            points,

            user,
            template,
            course,
            
            createdAt,
            updatedAt,
        );
      }

}