import { Router } from "express";
import { CoursesController } from "./controller";
import { SessionMiddleware } from "../middlewares/session.middleware";
import { CoursesService } from "../services/courses.service";

export class CoursesRoutes {

  static get routes(): Router {
    const router = Router();

    const service = new CoursesService();

    const controller = new CoursesController(service);
    router.use(SessionMiddleware.validateJwt);

    router.get("/", controller.listCourse);
    router.get("/all", controller.allCourses);
    router.get("/:id", controller.getCourse);
    router.post("/", controller.createCourse);
    router.put("/:id", controller.updateCourse);
    router.delete("/:id", controller.deleteCourse);

    return router;
  }
  
}
