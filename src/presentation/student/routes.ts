import { Router } from "express";
import { StudentService } from "../services";
import { SessionMiddleware } from "../middlewares";
import { StudentController } from "./controller";
import { CertifiedService } from "../services/certified.service";

export class StudentRoutes {

    static get routes(): Router {

        const router = Router();

        router.use(SessionMiddleware.validateJwt)

        const certified = new CertifiedService();
        const service = new StudentService(certified)
        const controller = new StudentController(service);

        router.get("/", controller.studentCourses);
        router.get("/certified/:identifier", controller.studentCertified);
    
        return router;
      }

}