import { Request, Response } from "express";
import { HandleErrorService } from '../services/handle-error.service';
import { CreateCoursesModuleDto, UpdateCoursesModuleDto } from "../../domain";
import { CoursesModulesService } from "../services/courses-modules.service";


export class CoursesModulesController {

    constructor(
        private readonly coursesService: CoursesModulesService
    ) {}

    allModules = async (req: Request, res: Response) => {

        const id = req.params.course;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.coursesService.allModules( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    getModules = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.coursesService.getModules( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    createModules = async (req: Request, res: Response) => {

        const [error, dto] = await CreateCoursesModuleDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.coursesService.createModules( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    updateModules = async (req: Request, res: Response) => {

        const [error, dto] = await UpdateCoursesModuleDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.coursesService.updateModules( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    deleteModules = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.coursesService.deleteModules( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

}