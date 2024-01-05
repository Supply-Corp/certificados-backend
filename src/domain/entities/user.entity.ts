
export class UserEntity {
    
  constructor() {}

  static fromObject(object: { [key: string]: any }) {
    return new UserEntity();
  }
  
}