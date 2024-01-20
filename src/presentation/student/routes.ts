import { Router } from "express";
import { StudentService } from "../services";
import { SessionMiddleware } from "../middlewares";
import { StudentController } from "./controller";
import { CertifiedService } from "../services/certified.service";
import { ConstancyService } from "../services/constance.service";

export class StudentRoutes {

    static get routes(): Router {

        const router = Router();

        router.use(SessionMiddleware.validateJwt)

        const certified = new CertifiedService();
        const constancy = new ConstancyService();
        const service = new StudentService(certified, constancy)
        const controller = new StudentController(service);

        router.get("/", controller.studentCourses);
        router.get("/certified/:identifier", controller.studentCertified);
        router.get("/constancy/:identifier", controller.studentConstancy);
    
        return router;
      }

}