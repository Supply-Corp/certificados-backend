import { Router } from "express";
import { UserCoursesController } from "./controller";
import { UserCoursesService } from "../services";
import { SessionMiddleware } from "../middlewares";

export class UserCoursesRoutes {

    static get routes(): Router {

        const router = Router();

        router.use(SessionMiddleware.validateJwt)

        const service = new UserCoursesService()
        const controller = new UserCoursesController(service);
        


        router.get("/", controller.listUser);
        router.post("/user", controller.registerUser);
        router.put("/user/:id", controller.updateUser);
        router.delete("/user/:id", controller.deleteUser);

        router.get("/:user", controller.listUserCourses);
        router.post("/",  controller.createUserCourses);
        router.put("/:id",  controller.updateUserCourses);
        router.delete("/:id",  controller.deleteUserCourses);
    
        return router;
      }

}