import { Request, Response } from "express";
import { HandleErrorService, UserCoursesService } from "../services";
import { CreateUserCourseDto, PaginationDto, RegisterDto, UpdateUserCourseDto, UpdateUserDto } from "../../domain";

export class UserCoursesController {
    
    constructor(
        private userCoursesService: UserCoursesService,
    ) {}

    listUser = async (req: Request, res: Response) => {
        
        const [error, dto] = await PaginationDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.userCoursesService.listUser( dto! )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }
    registerUser = async(req: Request, res: Response) =>  {
        
        const [error, dto] = await RegisterDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.userCoursesService.registerUser( dto! )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }
    updateUser = async(req: Request, res: Response) =>  {
        
        const [error, dto] = await UpdateUserDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.userCoursesService.updateUser( dto! )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }
    deleteUser = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.userCoursesService.deleteUser( +id )
        .then(course => { return res.send(course) })
        .catch(error => {       console.log(`${ error }`)
        return HandleErrorService.create(error, res) })
    }



    listUserCourses = async (req: Request, res: Response) => {

        const [error, dto] = await PaginationDto.create(req);
        if( error ) return res.status(400).json({ error });

        const id = req.params.user;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.userCoursesService.listUserCourses( dto!, +id )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }

    createUserCourses = async (req: Request, res: Response) => {

        const [error, dto] = await CreateUserCourseDto.create(req);
        if( error ) return res.status(400).json({ error });

        this.userCoursesService.createUserCourse( dto! )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }

    updateUserCourses = async (req: Request, res: Response) => {

        const [error, dto] = await UpdateUserCourseDto.create(req);
        if( error ) return res.status(400).json({ error });

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.userCoursesService.updateUserCourse( dto!, +id )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }

    deleteUserCourses = async (req: Request, res: Response) => {

        const id = req.params.id;
        if( !id ) return res.status(400).json({ error: 'Id es requerido '});
        if(isNaN(Number(id)) || !isFinite(Number(id))) return res.status(400).json({ error: 'Id no es numérico'});

        this.userCoursesService.deleteUserCourse( +id )
        .then(course => { return res.send(course) })
        .catch(error => { return HandleErrorService.create(error, res) })
    }

}