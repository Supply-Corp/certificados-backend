import { Router } from "express";
import { TemplatesController } from "./controller";
import fileUpload from "express-fileupload";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TemplatesService } from "../services";

export class TemplatesRoutes {

    static get routes(): Router {
        const router = Router();
    
        const fileService = new FileUploadService();
        const templateService = new TemplatesService(fileService); 

        const controller = new TemplatesController(templateService);
      
        router.use(fileUpload({
          limits: { fileSize: 50 * 1024 * 1024 },
        }));

        router.get("/", controller.listTemplate);
        router.get("/all", controller.allTemplate);
        router.get("/:id", controller.getTemplate);
        router.post("/", FileUploadMiddleware.containFiles, controller.createTemplate);
        router.put("/:id", controller.updateTemplate);
        router.delete("/:id", controller.deleteTemplate);
    
        return router;
      }

}