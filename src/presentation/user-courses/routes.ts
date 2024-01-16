import { Router } from "express";
import { UserCoursesController } from "./controller";
import { UserCoursesService } from "../services";

export class UserCoursesRoutes {

    static get routes(): Router {

        const router = Router();

        const service = new UserCoursesService()
        const controller = new UserCoursesController(service);

        router.get("/", controller.listUser);
        router.get("/:user", controller.listUserCourses);

        router.post("/",  controller.createUserCourses);
        router.put("/:id",  controller.updateUserCourses);
        router.delete("/:id",  controller.deleteUserCourses);
    
        return router;
      }

}