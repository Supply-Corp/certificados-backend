enum States {
  ACTIVE,
  DELETED
}

export class CourseEntity {
    
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly initialDate: Date,
    public readonly endDate: Date,
    public readonly state: States,

    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static fromObject(object: { [key: string]: any }) {

    const { id, name, initialDate, endDate, createdAt, updatedAt, state } = object;

    if( !id ) throw 'missing id';
    if( !name ) throw 'missing name';
    if( !initialDate ) throw 'missing initialDate';
    if( !endDate ) throw 'missing endDate';

    return new CourseEntity( id, name, initialDate, endDate, state, createdAt, updatedAt );
  }
  
}