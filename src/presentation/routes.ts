import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CoursesRoutes } from "./courses/routes";
import { TemplatesRoutes } from "./templates/routes";
import { UserCoursesRoutes } from './user-courses/routes';
import { CertifiedRoutes } from "./certified/routes";
import { CoursesModulesRoutes } from "./courses-module/routes";
import { StudentRoutes } from "./student/routes";

export class ServerRoutes {

  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);

    router.use("/api/courses", CoursesRoutes.routes);
    router.use("/api/courses-modules", CoursesModulesRoutes.routes);
    router.use("/api/templates", TemplatesRoutes.routes);
    router.use("/api/user-courses", UserCoursesRoutes.routes);
    router.use("/api/certified", CertifiedRoutes.routes);

    router.use("/api/student", StudentRoutes.routes);

    return router;
  }
  
}
