import { Request, Response } from "express";
import { HandleErrorService, StudentService } from "../services";



export class StudentController {

    constructor(
        private service: StudentService
    ) {}

    studentCourses = (req: Request, res: Response) => {
        const { id } = req.body.user;

        this.service.studentCourses( +id )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { return HandleErrorService.create(error, res) });
    }

    studentCertified = (req: Request, res: Response) => {
        const identifier = req.params.identifier;
        
        this.service.generateCertified( identifier )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { console.log(error); return HandleErrorService.create(error, res) });
    }

    studentConstancy = (req: Request, res: Response) => {
        const identifier = req.params.identifier;
        
        this.service.generateConstancy( identifier )
        .then((user) => { return res.status(200).json( user ) })
        .catch(error => { console.log(error); return HandleErrorService.create(error, res) });
    }
}