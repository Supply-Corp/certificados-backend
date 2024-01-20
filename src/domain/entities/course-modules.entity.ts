import { CourseEntity } from "./course.entity";

export class CourseModulesEntity {
      
    constructor(
      public readonly id: number,
      public readonly name: string,
      public readonly courseId: number,
      // public readonly course?: CourseEntity,
  
      public readonly createdAt?: Date,
      public readonly updatedAt?: Date
    ) {}
  
    static fromObject(object: { [key: string]: any }) {
  
      const { id, name, courseId, createdAt, updatedAt } = object;
  
      if( !id ) throw 'missing id';
      if( !name ) throw 'missing name';
      if( !courseId ) throw 'missing courseId';
      // if( course && !(course as CourseEntity) ) throw 'missing course';
  
      return new CourseModulesEntity( id, name, courseId, createdAt, updatedAt );
    }
    
  }