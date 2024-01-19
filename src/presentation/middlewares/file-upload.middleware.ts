import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleware {

    static containFiles(req: Request, res: Response, next: NextFunction) {

        if( !req.files || Object.keys(req.files).length === 0 || Object.keys(req.files).length < 2) {
            return res.status(400).json({ error: 'Uno o mas de los archivos requerido no ha sido' });
        }
    
        let filesArray: any[];
        let inputNames = Object.keys(req.files);
    
        if( !Array.isArray( req.files )) {
            filesArray = Object.values(req.files);
        }else {
            filesArray = req.files;
        }
    
        let result = inputNames.map((inputName, index) => {
            return {inputName: inputName, file: filesArray[index]};
        });
    
        req.body.files = result;
    
        next();
    
    }

    static updateFiles(req: Request, res: Response, next: NextFunction) {

        if( req.files ) {
            let filesArray: any[];
            let inputNames = Object.keys(req.files);
        
            if( !Array.isArray( req.files )) {
                filesArray = Object.values(req.files);
            }else {
                filesArray = req.files;
            }
        
            let result = inputNames.map((inputName, index) => {
                return {inputName: inputName, file: filesArray[index]};
            });
        
            req.body.files = result;
        
            next();
        
        }
    }
    

}