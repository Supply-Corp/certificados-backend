import { Router } from "express";
import { CoursesModulesController } from "./controller";
import { SessionMiddleware } from "../middlewares/session.middleware";
import { CoursesModulesService } from "../services";

export class CoursesModulesRoutes {

  static get routes(): Router {
    const router = Router();

    const service = new CoursesModulesService();

    const controller = new CoursesModulesController(service);
    router.use(SessionMiddleware.validateJwt);

    router.get("/:course", controller.allModules);
    router.get("/:id", controller.getModules);
    router.post("/", controller.createModules);
    router.put("/:id", controller.updateModules);
    router.delete("/:id", controller.deleteModules);

    return router;
  }
  
}
