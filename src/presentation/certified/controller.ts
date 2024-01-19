import { Request, Response } from "express";
import { CertifiedService } from "../services/certified.service";
import { HandleErrorService } from '../services/handle-error.service';


export class CertifiedController {

    constructor(
        private certifiedService: CertifiedService
    ) {}

    // generateCertified = async (req: Request, res: Response) => {

    //     await this.certifiedService.generate()
    //     .then(cert => res.status(200).json(cert))
    //     .catch(error => HandleErrorService.create(error, res))
    // }

}