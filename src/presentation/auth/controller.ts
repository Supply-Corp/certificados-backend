import { Request, Response } from "express"
import { AuthService } from "../services"
import { HandleErrorService } from '../services/handle-error.service';
import { ForgotPasswordDto, LoginDto, RegisterDto } from "../../domain";
import { RecoveryPasswordDto } from "../../domain/dtos/auth/recovery-password.dto";
import { BlackList } from "../../domain/models";

export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    loginUser = async ( req: Request, res: Response ) => {

        const [error, dto] = await LoginDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.authService.loginUser( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    registerUser = async ( req: Request, res: Response ) => {

        const [error, dto] = await RegisterDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.authService.registerUser( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    forgotPasswordUser = async ( req: Request, res: Response ) => {

        const [error, dto] = await ForgotPasswordDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.authService.forgotPasswordUser( dto! )
        .then((forgot) => { return res.status(200).json( forgot ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    recoveryPassword = async ( req: Request, res: Response) => {

        const [error, dto] = await RecoveryPasswordDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.authService.recoveryPassword( dto! )
        .then((forgot) => { return res.status(200).json( forgot ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    user = async (req: Request, res: Response) => {
        const user = req.body.user;
        if( user ) return res.status(200).json( user )
        return HandleErrorService.create('error user', res);
    }

    logout = async (req: Request, res: Response) => {

        const authorization = req.header('Authorization');

        if( !authorization ) return res.status(401).json({ error: 'Token no proveído' });
        if( !authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            await BlackList.create({ token });
            return res.status(200).json({ message: 'logout' });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}