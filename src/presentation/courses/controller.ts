import { Request, Response } from "express";
import { CoursesService } from "../services/courses.service";
import { HandleErrorService } from '../services/handle-error.service';
import {  CreateCoursesDto, PaginationDto, UpdateCoursesDto } from "../../domain";


export class CoursesController {

    constructor(
        private readonly coursesService: CoursesService
    ) {}

    listCourse = async (req: Request, res: Response) => {

        const [error, dto] = await PaginationDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.coursesService.listCourse( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    getCourse = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.coursesService.getCourse( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    createCourse = async (req: Request, res: Response) => {

        const [error, dto] = await CreateCoursesDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.coursesService.createCourse( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    updateCourse = async (req: Request, res: Response) => {

        const [error, dto] = await UpdateCoursesDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.coursesService.updateCourse( dto! )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

    deleteCourse = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.coursesService.deleteCourse( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => HandleErrorService.create(error, res));
    }

}