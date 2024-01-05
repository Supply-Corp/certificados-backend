import { Request, Response } from "express"
import { AuthService } from "../services"
import { HandleErrorService } from '../services/handle-error.service';

export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    loginUser = ( req: Request, res: Response ) => {

        this.authService.loginUser()
        .then((user) => res.send('login'))
        .catch((error) => HandleErrorService.create(error, res));
    }

    registerUser = ( req: Request, res: Response ) => {

        this.authService.registerUser()
        .then((user) => res.send('register'))
        .catch((error) => HandleErrorService.create(error, res));
    }

    forgotPasswordUser = ( req: Request, res: Response ) => {

        this.authService.forgotPasswordUser()
        .then((user) => res.send('forgot password'))
        .catch((error) => HandleErrorService.create(error, res));
    }

}