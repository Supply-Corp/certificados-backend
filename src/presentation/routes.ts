import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CoursesRoutes } from "./courses/routes";
import { TemplatesRoutes } from "./templates/routes";
import { UserCoursesRoutes } from './user-courses/routes';
import { CertifiedRoutes } from "./certified/routes";

export class ServerRoutes {

  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/courses", CoursesRoutes.routes);
    router.use("/api/templates", TemplatesRoutes.routes);
    router.use("/api/user-courses", UserCoursesRoutes.routes);
    router.use("/api/certified", CertifiedRoutes.routes);

    return router;
  }
  
}
