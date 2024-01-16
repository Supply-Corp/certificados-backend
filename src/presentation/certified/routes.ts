import { Router } from "express";
import { CertifiedController } from "./controller";
import { CertifiedService } from "../services/certified.service";

export class CertifiedRoutes {

  static get routes(): Router {

    const router = Router();
    const service = new CertifiedService();

    const controller = new CertifiedController(service);

    router.get("/generate/:course", controller.generateCertified)

    return router;

  }
  
}