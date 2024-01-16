import { Request, Response } from "express"
import { HandleErrorService, TemplatesService } from "../services";
import { CreateTemplateDto, PaginationDto, UpdateTemplateDto } from "../../domain";


export class TemplatesController {

    constructor(
        private templateService: TemplatesService
    ) {}

    listTemplate = async (req: Request, res: Response) => {
        const [error, dto] = await PaginationDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.templateService.listTemplate( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { return HandleErrorService.create(error, res) });
    }

    getTemplate = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.templateService.getTemplate( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { 
            console.log(error)
            return HandleErrorService.create(error, res)
         });

    }

    createTemplate = async (req: Request, res: Response) => {

        const [error, dto] = await CreateTemplateDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.templateService.createTemplate( dto! )
        .then(uploaded => { return res.json(uploaded) })
        .catch(error => { return HandleErrorService.create(error, res) });

    }

    updateTemplate = async (req: Request, res: Response) => {

        const [error, dto] = await UpdateTemplateDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.templateService.updateTemplate( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { return HandleErrorService.create(error, res) });
    }

    deleteTemplate = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.templateService.deleteTemplate( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { return HandleErrorService.create(error, res) });

    }

}