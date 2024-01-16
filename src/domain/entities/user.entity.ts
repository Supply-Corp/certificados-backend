enum Role {
  USER,
  ADMIN
}

export class UserEntity {
  
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly documentNumber: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static fromObject(object: { [key: string]: any }) {

    const {
      id,
      name,
      lastName,
      documentNumber,
      email,
      password,
      role,
      createdAt,
      updatedAt,
    } = object;

    if (!id) throw "missing id";
    if (!name) throw "missing name";
    if (!lastName) throw "missing lastName";
    if (!documentNumber) throw "missing documentNumber";
    if (!email) throw "missing email";
    if (!password) throw "missing password";
    if( !role ) throw "missing role";
    if( !(role in Role))  throw "user role is invalid";

    return new UserEntity(
      id,
      name,
      lastName,
      documentNumber,
      email,
      password,
      role,
      createdAt,
      updatedAt
    );
  }
}
