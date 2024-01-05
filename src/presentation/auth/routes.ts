import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const service = new AuthService();
    const controller = new AuthController(service);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.post("/forgot-password", controller.forgotPasswordUser);

    return router;
  }

}
