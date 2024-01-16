import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";
import { SessionMiddleware } from "../middlewares";

export class AuthRoutes {

  static get routes(): Router {
    
    const router = Router();

    const { MAILER_SERVICE, MAILER_EMAIL, MAILER_SECRET } = envs;

    const email = new EmailService(MAILER_SERVICE, MAILER_EMAIL, MAILER_SECRET);

    const service = new AuthService(email);
    const controller = new AuthController(service);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.post("/forgot-password", controller.forgotPasswordUser);
    router.post("/recovery-password", controller.recoveryPassword);
    router.get('/user', SessionMiddleware.validateJwt, controller.user)
    router.get('/logout', SessionMiddleware.validateJwt, controller.logout)

    return router;
  }

}
