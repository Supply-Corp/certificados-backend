import {
  CustomError,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  UserEntity,
} from "../../domain";

import { HashAdapter, JwtAdapter, envs } from "../../config";
import { RecoveryPasswordDto } from '../../domain/dtos/auth/recovery-password.dto';
import { EmailService } from './email.service';
import { UserModel } from "../../domain/models";

export class AuthService {

  constructor(
    public readonly emailService: EmailService
  ) {}

  async loginUser(dto: LoginDto) {

    const exist = await UserModel.findOne({ where: { email: dto.email } });
    if (!exist) throw CustomError.notFound("Información inválida, revisa tu email o contraseña");

    const isMatching = HashAdapter.compare(dto.password, exist.password);
    if (!isMatching) throw CustomError.unauthorized("Email o contraseña inválidos");

    const { password, ...userEntity } = UserEntity.fromObject(exist);

    const token = await JwtAdapter.generateToken({ id: userEntity.id });
    if (!token) throw CustomError.unauthorized("No fue posible generar una sesión");

    return {
      user: userEntity,
      token: token,
    };
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

      const token = await JwtAdapter.generateToken({ id: userEntity.id });

      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServe(`${error}`);
    }
  }

  async forgotPasswordUser(dto: ForgotPasswordDto) {

    const exist = await UserModel.findOne({ where: { email: dto.email }});
    if( !exist ) throw CustomError.badRequest('No se encontró un registro con el email.');

    try {

      await this.sendEmailForgotPassword( dto.email );
      await UserModel.update({ recoveryPassword: true }, { where: { email: dto.email }});
      return { message: 'Email enviado con éxito' };

    } catch (error) {
      throw CustomError.internalServe(`${ error }`);
    }
  }

  async sendEmailForgotPassword( email: string ) {

    const token = await JwtAdapter.generateToken({ email: email }, "1h");
    if( !token ) throw CustomError.internalServe('Error generating JWT');

    const link = `${ envs.WEB_SERVICE_URL }/auth/validate-email/${ token }`;

    const options = {
      to: email,
      subject: 'Recuperar contraseña',
      htmlBody: `
        <h1>Recupera tu contraseña</h1>
        <p>Ingresa al siguiente enlace para recuperar tu cuenta.</p>
        
        <a href="${ link }">Recupera tu cuenta: ${ email }</a>
        
        <small>El enlace estará vigente durante la siguiente hora</small>
      `
    }

    const isSent = await this.emailService.sendEmail( options );
    if( !isSent ) throw CustomError.internalServe('Error sending email activation');

    return true;
  }

  async recoveryPassword( dto: RecoveryPasswordDto) {

    const payload = await JwtAdapter.validateToken( dto.token );
    if( !payload ) throw CustomError.badRequest('Imposible validar el enlace de recuperación');

    const { email } = payload as { email: string };
    if( !email ) throw CustomError.badRequest('El email no se encuentra en el token'); 

    const user = await UserModel.findOne({ where: { email } });
    if( !user ) throw CustomError.badRequest('El email del usuario es inválido');

    if( !user.recoveryPassword ) throw CustomError.badRequest('El token ha expirado o no es válido');

    const update = await UserModel.update({
        password: HashAdapter.hash(dto.password),
        recoveryPassword: null
      },
      { where: { email } }, 
    );

    const { password, ...userEntity } = UserEntity.fromObject(update);

    return {
      user: userEntity
    }
  }
  
}
