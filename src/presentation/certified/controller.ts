import { Request, Response } from "express";
import { CertifiedService } from "../services/certified.service";
import { HandleErrorService } from '../services/handle-error.service';
import { CustomError } from "../../domain";


export class CertifiedController {

    constructor(
        private certifiedService: CertifiedService
    ) {}

    search = async (req: Request, res: Response) => {

        const search = req.body.search;
        if( !search ) throw CustomError.badRequest('Requerido el identificador del certificado');

        await this.certifiedService.search( search )
        .then(cert => res.status(200).json(cert))
        .catch(error => HandleErrorService.create(error, res))
    }

}