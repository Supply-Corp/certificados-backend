import { Request, Response } from "express";
import { HandleErrorService, StudentService } from "../services";
import { CustomError } from "../../domain";
import { UploadedFile } from "express-fileupload";
import xlsx from "xlsx";
import { UserModel } from "../../domain/models";
import { HashAdapter } from "../../config";
import fs from 'fs';

interface Import {
    name: string,
    lastName: string,
    documentNumber: string,
    email: string,
    password: string
}

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

    importStudents = async (req: Request, res: Response) => {

        const excel = req.files?.file as UploadedFile;
        if( !excel ) throw CustomError.badRequest('El archivo es requerido')

        if( excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ){ 
            throw CustomError.badRequest('El archivo cargado no es un excel');
        }

        const readFile =  xlsx.readFile(excel.tempFilePath);
        const sheetName = readFile.SheetNames[0];

        const data = xlsx.utils.sheet_to_json(readFile.Sheets[sheetName]) as Import[];

        const saveData = await Promise.all(data.map(async (item: Import) => {
            const { name, lastName, documentNumber, email, password } = item;

            if(name && lastName && documentNumber && email && password) {

                const exist = await UserModel.findOne({ where: { email: item.email }});
                if(!exist) {
                    return await UserModel.create({
                        name,
                        lastName,
                        documentNumber,
                        email,
                        password: HashAdapter.hash(password)
                    });
                } 

            }
        }));

        if(!saveData) throw CustomError.badRequest('Ocurrió un error al importar el archivo');
        

        fs.unlinkSync(excel.tempFilePath);
        return res.status(200).json({ msg: 'Importación exitosa' });

    }
}